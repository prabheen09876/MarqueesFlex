import express from 'express';
import multer from 'multer';
import path from 'path';
import { getDb } from '../database.js';
import { sendOrderNotification } from '../utils/telegram.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    console.log('Generated filename:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and GIF images are allowed'));
    }
    cb(null, true);
  }
}).array('images', 5);

// Configure static file serving
router.use('/uploads', express.static(uploadsDir));

// Handle cart orders
router.post('/cart', express.json(), async (req, res) => {
  try {
    console.log('Received cart order:', req.body);
    const { name, email, phone, address, notes, items, total } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !address || !items || !total) {
      console.error('Missing required fields:', { name, email, phone, address, items, total });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format items for database
    const itemsJson = JSON.stringify(items);

    // Insert order into database
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO orders (name, email, phone, address, notes, items, total, type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, address, notes, itemsJson, total, 'cart', 'pending']
    );

    const order = {
      id: result.lastID,
      name,
      email,
      phone,
      address,
      notes,
      items,
      total,
      type: 'cart',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Format Telegram message
    const itemsList = items.map(item => 
      `• ${item.name} × ${item.quantity} (₹${item.price.toLocaleString('en-IN')})`
    ).join('\n');

    const message = `
🛍️ New Cart Order Received!

👤 Customer Details:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}
• Address: ${address}

📝 Order Details:
${itemsList}

💰 Total: ₹${total.toLocaleString('en-IN')}

📌 Additional Notes: ${notes || 'None'}

🔢 Order ID: #${order.id}
⏰ Time: ${new Date().toLocaleString('en-IN')}
`;

    // Send Telegram notification
    await sendOrderNotification(message);
    console.log('Order created successfully:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating cart order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle custom orders (with file uploads)
router.post('/custom', async (req, res) => {
  try {
    console.log('Received custom order request');
    
    // Handle file upload with error handling
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          console.error('Multer error:', err);
          reject(new Error(`Upload error: ${err.message}`));
        } else if (err) {
          console.error('Upload error:', err);
          reject(err);
        }
        resolve();
      });
    });

    console.log('Files uploaded:', req.files);
    const { name, email, phone, description } = req.body;
    console.log('Received order data:', { name, email, phone, description });
    
    // Validate required fields
    if (!name || !email || !phone || !description) {
      console.error('Missing required fields:', { name, email, phone, description });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get file paths and ensure they exist
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const filePath = path.join(uploadsDir, file.filename);
        console.log('Checking uploaded file:', filePath);
        
        if (fs.existsSync(filePath)) {
          const relativePath = '/uploads/' + file.filename;
          console.log('Storing relative path:', relativePath);
          images.push(relativePath);
        } else {
          console.error('Uploaded file not found:', filePath);
        }
      }
    }
    
    console.log('Final image paths:', images);

    // Insert order into database
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO orders (name, email, phone, description, status, images, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, description, 'pending', JSON.stringify(images), 'custom']
    );

    const order = {
      id: result.lastID,
      name,
      email,
      phone,
      description,
      status: 'pending',
      images,
      type: 'custom',
      created_at: new Date().toISOString()
    };

    console.log('Created custom order:', order);

    // Format Telegram message
    const message = `
🎨 New Custom Order Received!

👤 Customer Details:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}

📝 Order Details:
${description}

🖼️ Images: ${images.length > 0 ? images.length + ' images attached' : 'No images'}

🔢 Order ID: #${order.id}
⏰ Time: ${new Date().toLocaleString('en-IN')}
`;

    // Send Telegram notification with images
    await sendOrderNotification(message, images);
    console.log('Custom order created successfully:', order);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating custom order:', error);
    res.status(500).json({ error: error.message || 'Failed to create custom order' });
  }
});

// Get order by tracking ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const order = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Parse JSON fields
    try {
      order.images = JSON.parse(order.images || '[]');
      order.items = JSON.parse(order.items || '[]');
    } catch (e) {
      order.images = [];
      order.items = [];
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;