import { Request } from '@vercel/edge';
import { CartItem } from '../src/types';

interface OrderData {
    orderType: 'cart' | 'custom';
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    items?: CartItem[];
    total?: number;
    category?: string;
    description?: string;
}

export default async function handler(req: Request) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;

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

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Telegram configuration missing',
        details: {
          botToken: !!TELEGRAM_BOT_TOKEN,
          chatId: !!TELEGRAM_CHAT_ID
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

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
        `📝 Description: ${description}\n` +
        `\n⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
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
        `📝 Notes: ${notes || 'None'}\n` +
        `\n⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
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

    const telegramResponseText = await telegramResponse.text();

    if (!telegramResponse.ok) {
      throw new Error(`Failed to send Telegram message. Status: ${telegramResponse.status}, Response: ${telegramResponseText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order notification sent successfully',
        telegramResponse: telegramResponseText 
      }),
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
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send order notification',
        error: String(error)
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