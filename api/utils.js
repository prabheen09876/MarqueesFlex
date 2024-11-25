import TelegramBot from 'node-telegram-bot-api';

// Create a bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

/**
 * Send order notification to admin via Telegram
 */
export async function sendOrderNotification(message, images = []) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Telegram configuration missing');
      return;
    }

    // Send the text message
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { 
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    // If there are image URLs, send them
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        try {
          await bot.sendPhoto(process.env.TELEGRAM_CHAT_ID, imageUrl);
        } catch (imageError) {
          console.error('Error sending image to Telegram:', imageError);
        }
      }
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    // Don't throw the error to prevent order processing from failing
  }
}