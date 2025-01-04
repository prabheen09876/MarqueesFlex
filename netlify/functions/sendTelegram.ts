import { Handler } from '@netlify/functions';
import { CartItem } from '../../src/types';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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

const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method not allowed' }),
        };
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Telegram configuration missing' }),
        };
    }

    try {
        const orderData: OrderData = JSON.parse(event.body || '{}');
        const { orderType, ...data } = orderData;

        let message = '';

        if (orderType === 'custom') {
            const { name, email, phone, category, description } = data;
            message = `🎨 New Custom Order!\n\n` +
                `👤 Customer: ${name}\n` +
                `📧 Email: ${email}\n` +
                `📱 Phone: ${phone}\n` +
                `🏷️ Category: ${category}\n` +
                `📝 Description: ${description}\n` +
                `\n⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
        } else if (orderType === 'cart') {
            const { name, email, phone, address, notes, items, total } = data;
            const itemsList = items?.map((item) =>
                `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
            ).join('\n');

            message = `🛍️ New Cart Order!\n\n` +
                `👤 Customer Details:\n` +
                `• Name: ${name}\n` +
                `• Email: ${email}\n` +
                `• Phone: ${phone}\n` +
                `• Address: ${address}\n` +
                `\n📦 Order Items:\n${itemsList}\n` +
                `\n💰 Total: ₹${total?.toLocaleString('en-IN')}\n` +
                `📝 Notes: ${notes || 'None'}\n` +
                `\n⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`;
        }

        // Send to Telegram
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

        if (!telegramResponse.ok) {
            throw new Error('Failed to send Telegram message');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Order notification sent successfully',
            }),
        };
    } catch (error) {
        console.error('Error processing order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to process order',
            }),
        };
    }
};

export { handler };