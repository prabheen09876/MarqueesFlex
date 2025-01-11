import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
};

const sendTelegramMessage = async (text: string) => {
    try {
        if (!token || !chatId) {
            throw new Error('Missing Telegram configuration');
        }

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
        } catch (error) {
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
                error: error instanceof Error ? error.message : 'Internal server error'
            })
        };
    }
};

export { handler }; 