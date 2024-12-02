import { db } from '../../src/firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const TELEGRAM_BOT_TOKEN = process.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.VITE_TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  items?: OrderItem[];
  category?: string;
  description?: string;
  totalAmount?: number;
  timestamp?: any;
}

export async function saveOrderToFirebase(orderDetails: OrderDetails, isCustomOrder: boolean) {
  try {
    const ordersRef = collection(db, isCustomOrder ? 'customOrders' : 'cartOrders');
    const orderData = {
      ...orderDetails,
      timestamp: Timestamp.now(),
      status: 'pending'
    };
    
    const docRef = await addDoc(ordersRef, orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order to Firebase:', error);
    throw error;
  }
}

export async function sendTelegramMessage(orderDetails: OrderDetails, isCustomOrder: boolean) {
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  
  let message = `🛍️ *New ${isCustomOrder ? 'Custom' : 'Cart'} Order*\n\n`;
  message += `👤 *Customer Details*\n`;
  message += `Name: ${orderDetails.name}\n`;
  message += `Email: ${orderDetails.email}\n`;
  message += `Phone: ${orderDetails.phone}\n\n`;

  if (isCustomOrder) {
    message += `📦 *Custom Order Details*\n`;
    message += `Category: ${orderDetails.category}\n`;
    message += `Description: ${orderDetails.description}\n`;
  } else if (orderDetails.items) {
    message += `🛒 *Order Items*\n`;
    orderDetails.items.forEach(item => {
      message += `- ${item.name} (${item.quantity}x) @ ${formatCurrency(item.price)}\n`;
    });
    message += `\n💰 *Total Amount*: ${formatCurrency(orderDetails.totalAmount || 0)}`;
  }

  try {
    const response = await fetch(TELEGRAM_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send Telegram notification');
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}
