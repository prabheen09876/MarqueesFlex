import { CartItem } from '../types';

const TELEGRAM_BOT_TOKEN = '7885175271:AAEXwydCMX6E78Dvt2uXPR9qn64w1VCe2tM';
const TELEGRAM_CHAT_ID = '6967298820';

interface OrderData {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
    items: CartItem[];
    total: number;
}

export async function createOrder(orderData: OrderData) {
    try {
        // Format items for Telegram message
        const itemsList = orderData.items
            .map(item => `• ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
            .join('\n');

        // Format Telegram message
        const message = `
🛍️ New Order Received!

👤 Customer Details:
• Name: ${orderData.name}
• Email: ${orderData.email}
• Phone: ${orderData.phone}
• Address: ${orderData.address}
${orderData.notes ? `• Notes: ${orderData.notes}` : ''}

📦 Order Items:
${itemsList}

💰 Total: ₹${orderData.total.toLocaleString('en-IN')}

⏰ Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

        // Send to Telegram
        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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
            throw new Error('Failed to send Telegram notification');
        }

        // Store order in localStorage for order history
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
            ...orderData,
            id: Date.now().toString(),
            status: 'pending',
            created_at: new Date().toISOString(),
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));

        return { success: true, order: newOrder };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
} 