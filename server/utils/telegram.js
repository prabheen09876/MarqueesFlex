import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
}

if (!chatId) {
  throw new Error('TELEGRAM_CHAT_ID is not set in environment variables');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '../..');

// Create a bot instance
const bot = new TelegramBot(token, { polling: false });

/**
 * Send order notification to admin
 */
export async function sendOrderNotification(message, images = []) {
  try {
    // First send the text message
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });

    // Then send each image if available
    if (images && images.length > 0) {
      for (const imagePath of images) {
        const fullPath = path.join(projectRoot, imagePath.replace(/^\//, ''));
        if (fs.existsSync(fullPath)) {
          try {
            await bot.sendPhoto(chatId, fs.createReadStream(fullPath));
          } catch (imageError) {
            console.error('Error sending image to Telegram:', imageError);
          }
        } else {
          console.error('Image file not found:', fullPath);
        }
      }
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}

/**
 * Initialize the Telegram bot
 */
export async function initTelegramBot() {
  try {
    console.log('Initializing Telegram bot...');
    const me = await bot.getMe();
    console.log('Bot initialized successfully:', me);
    
    // Send a test message
    await sendOrderNotification('🟢 MarqueesFlex Order System is now online!');
    console.log('Startup message sent successfully');
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
    throw error;
  }
}