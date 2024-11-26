import { sendOrderNotification } from '../../server/utils/telegram.js';
import { getDb } from '../../server/database.js';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request body:', req.body);
    const { name, email, phone, description, images } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !description) {
      console.error('Missing required fields:', { name, email, phone, description });
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
      images: images || [],
      type: 'custom',
      created_at: new Date().toISOString()
    };

    console.log('Created order object:', order);

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

    console.log('Sending Telegram notification...');
    await sendOrderNotification(message, images);
    console.log('Telegram notification sent successfully');
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      error: 'Failed to create custom order',
      details: error.message 
    });
  }
}