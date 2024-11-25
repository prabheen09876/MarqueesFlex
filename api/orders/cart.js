import { sendOrderNotification } from '../../server/utils/telegram.js';
import { getDb } from '../../server/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, items } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !items || !items.length) {
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

    // Send Telegram notification
    await sendOrderNotification(message);
    
    return res.status(201).json(order);
  } catch (error) {
    console.error('Error creating cart order:', error);
    return res.status(500).json({ error: 'Failed to create cart order' });
  }
}