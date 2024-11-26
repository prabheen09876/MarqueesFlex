import fetch from 'node-fetch';

// Removed the bot instance creation as it's no longer needed

/**
 * Send order notification to admin via Telegram
 */
export async function sendOrderNotification(message, images = []) {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Telegram configuration missing');
      return;
    }

    // Send text message
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const messageResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Telegram API error:', error);
    }

    // Send images if any
    if (images && images.length > 0) {
      const photoUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;
      
      for (const imageUrl of images) {
        try {
          const photoResponse = await fetch(photoUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              photo: imageUrl
            })
          });

          if (!photoResponse.ok) {
            const error = await photoResponse.text();
            console.error('Error sending image to Telegram:', error);
          }
        } catch (imageError) {
          console.error('Error sending image:', imageError);
        }
      }
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}