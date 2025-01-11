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
            throw new Error('Missing Telegram configuration');
        }

        console.log('Sending to Telegram:', {
            chatId,
            messageLength: text.length,
            hasToken: !!token
        });

        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
    console.log('Received request:', {
        method: event.httpMethod,
        path: event.path,
        headers: event.headers
    });

    // Handle CORS preflight
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

        // Parse and validate request body
        let message;
        try {
            const body = JSON.parse(event.body || '{}');
            message = body.message;
            console.log('Parsed message:', message);
        } catch (error) {
            console.error('JSON parse error:', error);
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

        // Send message to Telegram
        const result = await sendTelegramMessage(message);

        const response = {
            success: true,
            message: 'Notification sent successfully',
            result
        };

        console.log('Sending response:', response);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response)
        };
    } catch (error) {
        console.error('Function error:', error);

        const errorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Internal server error',
            details: error instanceof Error ? error.stack : undefined
        };

        console.log('Sending error response:', errorResponse);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify(errorResponse)
        };
    }
};

export { handler }; 