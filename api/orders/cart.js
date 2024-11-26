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
    const { name, email, phone, items } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !items || !items.length) {
      console.error('Missing required fields:', { name, email, phone, items });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Insert order into database
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO orders (name, email, phone, items, total, status, type) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, JSON.stringify(items), total, 'pending', 'cart']
    );

    const order = {
      id: result.lastID,
      name,
      email,
      phone,
      items,
      total,
      status: 'pending',
      type: 'cart',
      created_at: new Date().toISOString()
    };

    console.log('Created order object:', order);

    // Format items for Telegram message
    const itemsList = items.map(item => 
      `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');

    // Format Telegram message
    const message = `
🛒 New Cart Order Received!

👤 Customer Details:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}

📦 Order Items:
${itemsList}

💰 Total: ₹${total}

🔢 Order ID: #${order.id}
⏰ Time: ${new Date().toLocaleString('en-IN')}
    `;

    console.log('Sending Telegram notification...');
    await sendOrderNotification(message);
    console.log('Telegram notification sent successfully');
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      error: 'Failed to create cart order',
      details: error.message 
    });
  }
}