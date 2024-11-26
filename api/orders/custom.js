import { sendOrderNotification } from '../utils.js';

export default async function handler(req, res) {
  console.log('Starting custom order handler');
  
  try {
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
      console.log('Handling OPTIONS request');
      res.status(200).end();
      return;
    }

    if (req.method !== 'POST') {
      console.log('Invalid method:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    const { name, email, phone, description, images } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !description) {
      console.error('Missing required fields:', { name, email, phone, description });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { name, email, phone, description }
      });
    }

    const order = {
      id: Date.now(),
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
    
    return res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return res.status(500).json({ 
      error: error.message || 'Failed to create custom order',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}