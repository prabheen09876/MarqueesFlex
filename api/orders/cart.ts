export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Handle actual request
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, address, notes, items, total } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !items || !total) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields',
          details: {
            name: !name,
            email: !email,
            phone: !phone,
            address: !address,
            items: !items,
            total: !total
          }
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid or empty items array' 
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const itemsList = items.map((item: any) => 
      `- ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const message = `
🛍️ <b>New Cart Order Received!</b>

👤 <b>Customer Details:</b>
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
${notes ? `\nNotes: ${notes}` : ''}

🛒 <b>Order Items:</b>
${itemsList}

💰 <b>Total Amount:</b> ₹${total.toLocaleString('en-IN')}

📅 Order Date: ${new Date().toLocaleString()}
    `;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7885175271:AAFq14mUhtzxuweV_DCAHRmKYk3r1vPVKk8';
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1157438477';

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API Error:', telegramData);
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Failed to send order notification',
          error: telegramData
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Order placed successfully'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
