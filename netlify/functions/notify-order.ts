import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

const sendTelegramMessage = async (text: string) => {
    try {
        if (!token || !chatId) {
            console.error('Missing configuration:', { hasToken: !!token, hasChatId: !!chatId });
            throw new Error('Missing Telegram configuration');
        }

        console.log('Attempting to send message to Telegram:', {
            chatId,
            messageLength: text.length,
            messagePreview: text.substring(0, 100) + '...'
        });

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        console.log('Sending request to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML'
            })
        });

        const data = await response.json();
        console.log('Telegram API response:', data);

        if (!response.ok) {
            throw new Error(data.description || 'Failed to send Telegram message');
        }

        return data;
    } catch (error) {
        console.error('Telegram API error:', error);
        throw error;
    }
};

const handler: Handler = async (event) => {
    console.log('Function invoked:', {
        method: event.httpMethod,
        headers: event.headers,
        body: event.body ? event.body.substring(0, 200) : null
    });

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: corsHeaders,
            body: ''
        };
    }

    try {
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Method not allowed'
                })
            };
        }

        let message;
        try {
            const body = JSON.parse(event.body || '{}');
            message = body.message;
            console.log('Parsed message:', message);
        } catch (error) {
            console.error('JSON parse error:', error, 'Raw body:', event.body);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid JSON body'
                })
            };
        }

        if (!message) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    error: 'Message is required'
                })
            };
        }

        const result = await sendTelegramMessage(message);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: 'Notification sent successfully',
                result
            })
        };
    } catch (error) {
        console.error('Function error:', error);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
                details: error instanceof Error ? error.stack : undefined
            })
        };
    }
};

export { handler }; 