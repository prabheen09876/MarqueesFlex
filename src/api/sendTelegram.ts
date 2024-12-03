import { CartItem } from '../types';

const TELEGRAM_BOT_TOKEN = '7885175271:AAFq14mUhtzxuweV_DCAHRmKYk3r1vPVKk8';
const TELEGRAM_CHAT_ID = '1157438477';

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

export async function sendTelegramMessage(orderData: OrderData) {
    try {
        const { orderType, ...data } = orderData;
        let message = '';

        if (orderType === 'custom') {
            const { name, email, phone, category, description } = data;
            message = `🎨 New Custom Order!\n\n` +
                `👤 Customer: ${name}\n` +
                `📧 Email: ${email}\n` +
                `📱 Phone: ${phone}\n` +
                `🏷️ Category: ${category}\n` +
                `📝 Description: ${description}`;
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

        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const response = await fetch(telegramApiUrl, {
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

        if (!response.ok) {
            throw new Error('Failed to send Telegram message');
        }

        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        console.error('Error sending telegram message:', error);
        throw error;
    }
} 