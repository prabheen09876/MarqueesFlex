import fetch from 'node-fetch';

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
    console.log('Sending message to Telegram');
    
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
      console.log(`Processing ${images.length} images for Telegram`);
      const photoUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`;
      
      for (const base64Image of images) {
        try {
          // Skip if not a valid base64 image
          if (!base64Image || typeof base64Image !== 'string' || !base64Image.startsWith('data:image/')) {
            console.warn('Invalid image data received');
            continue;
          }

          console.log('Sending image to Telegram...');
          const photoResponse = await fetch(photoUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              photo: base64Image,
              caption: 'Order Image'
            })
          });

          const photoResult = await photoResponse.json();
          
          if (!photoResponse.ok) {
            console.error('Error sending image to Telegram:', photoResult);
            throw new Error(`Failed to send image: ${JSON.stringify(photoResult)}`);
          }

          console.log('Successfully sent image to Telegram');
        } catch (imageError) {
          console.error('Error processing image:', imageError);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in sendOrderNotification:', error);
    throw error;
  }
}