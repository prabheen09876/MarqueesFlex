export const config = {
  runtime: 'edge'
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  const TELEGRAM_BOT_TOKEN = '7885175271:AAFq14mUhtzxuweV_DCAHRmKYk3r1vPVKk8';
  const TELEGRAM_CHAT_ID = '1157438477';

  try {
    const body = await req.json();
    const { name, email, phone, address, notes, items, total } = body;

    if (!name || !email || !phone || !address || !items || !total) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
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
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Order placed successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
