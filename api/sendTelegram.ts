import { VercelRequest, VercelResponse } from '@vercel/node';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7885175271:AAFq14mUhtzxuweV_DCAHRmKYk3r1vPVKk8';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1157438477';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, description } = request.body;

    if (!name || !email || !phone || !description) {
      return response.status(400).json({ message: 'Missing required fields' });
    }

    const message = `
🛍️ <b>New Order Received!</b>

👤 <b>Customer Details:</b>
Name: ${name}
Email: ${email}
Phone: ${phone}

📝 <b>Project Description:</b>
${description}

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
      return response.status(500).json({ 
        message: telegramData.description || 'Failed to send message to Telegram',
        error: telegramData 
      });
    }

    return response.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    return response.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
