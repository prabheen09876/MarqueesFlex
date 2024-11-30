import { sendOrderNotification } from '../../server/utils/telegram.js';
import { getDb } from '../../server/database.js';

export const config = {
  api: {
    bodyParser: true
  }
};

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
}

export default async function handler(req: any, res: any) {
  
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
    const { name, email, phone, address, notes, items }: OrderRequest = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !address || !items || !items.length) {
      console.error('Missing required fields:', { name, email, phone, address, items });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          name: !name,
          email: !email,
          phone: !phone,
          address: !address,
          items: !items || !items.length
        }
      });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Format items for Telegram message
    const itemsList = items.map(item => 
      `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    // Format Telegram message
    const message = `
🛍️ New Cart Order Received!

👤 Customer Details:
• Name: ${name}
• Email: ${email}
• Phone: ${phone}
• Address: ${address}
${notes ? `• Notes: ${notes}` : ''}

📦 Order Items:
${itemsList}

💰 Total: ₹${total.toLocaleString('en-IN')}

⏰ Time: ${new Date().toLocaleString('en-IN')}
    `;

    try {
      console.log('Sending Telegram notification...');
      await sendOrderNotification(message);
      console.log('Telegram notification sent successfully');
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      // Continue processing even if Telegram notification fails
    }

    // Store order in database
    try {
      const db = await getDb();
      const result = await db.run(
        `INSERT INTO orders (name, email, phone, address, notes, items, total, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, address, notes || null, JSON.stringify(items), total, 'pending']
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
        status: 'pending',
        created_at: new Date().toISOString()
      };

      console.log('Created order object:', order);

      return res.status(201).json(order);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ 
        error: 'Failed to store order',
        details: dbError.message 
      });
    }
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
