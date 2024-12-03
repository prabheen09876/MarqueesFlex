import { CartItem } from '../types';

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
        const response = await fetch('/.netlify/functions/sendTelegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Failed to send order notification');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending telegram message:', error);
        throw error;
    }
}