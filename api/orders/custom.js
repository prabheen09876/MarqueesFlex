import { sendOrderNotification } from '../../server/utils/telegram.js';
import { getDb } from '../../server/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, description, images } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

    // Format Telegram message
    const message = `
🎨 New Custom Order Received!

👤 Customer Details:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}

📝 Order Details:
${description}

🖼️ Images: ${images ? images.length + ' images attached' : 'No images'}

🔢 Order ID: #${order.id}
⏰ Time: ${new Date().toLocaleString('en-IN')}
    `;

    // Send Telegram notification
    await sendOrderNotification(message, images);
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating custom order:', error);
    return res.status(500).json({ error: 'Failed to create custom order' });
  }
}