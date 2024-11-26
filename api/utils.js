import fetch from 'node-fetch';

// Removed the bot instance creation as it's no longer needed

/**
 * Send order notification to admin via Telegram
 */
export async function sendOrderNotification(message, images = []) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing');
    throw new Error('Telegram configuration missing');
  }

  try {
    // Send text message
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    console.log('Sending message to Telegram:', message);
    
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

    const messageResult = await messageResponse.json();
    console.log('Telegram message response:', messageResult);

    if (!messageResponse.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(messageResult)}`);
    }

    // Send images if any
    if (images && images.length > 0) {
      console.log('Sending images to Telegram:', images);
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

          const photoResult = await photoResponse.json();
          console.log('Telegram photo response:', photoResult);

          if (!photoResponse.ok) {
            console.error('Error sending image to Telegram:', photoResult);
          }
        } catch (imageError) {
          console.error('Error sending image:', imageError);
        }
      }
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}