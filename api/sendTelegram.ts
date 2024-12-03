import { Request } from '@vercel/edge';

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
    const { orderType, ...orderData } = body;

    let message = '';
    
    if (orderType === 'custom') {
      const { name, email, phone, category, description } = orderData;
      message = `🎨 New Custom Order!\n\n` +
        `👤 Customer: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📱 Phone: ${phone}\n` +
        `🏷️ Category: ${category}\n` +
        `📝 Description: ${description}`;
    } else if (orderType === 'cart') {
      const { name, email, phone, address, notes, items, total } = orderData;
      const itemsList = items.map((item: any) => 
        `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})`
      ).join('\n');

      message = `🛍️ New Cart Order!\n\n` +
        `👤 Customer: ${name}\n` +
        `📧 Email: ${email}\n` +
        `📱 Phone: ${phone}\n` +
        `📍 Address: ${address}\n` +
        `\n🛒 Items:\n${itemsList}\n` +
        `\n💰 Total: ₹${total}\n` +
        `📝 Notes: ${notes || 'None'}`;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!telegramResponse.ok) {
      throw new Error('Failed to send Telegram message');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Order notification sent successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending telegram message:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to send order notification' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
