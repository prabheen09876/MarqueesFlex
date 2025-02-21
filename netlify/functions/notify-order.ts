import { Handler } from '@netlify/functions';
import axios from 'axios';

console.log('Loading function with environment:', {
    NODE_ENV: process.env.NODE_ENV,
    hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasChat: !!process.env.TELEGRAM_CHAT_ID,
    envKeys: Object.keys(process.env)
});

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
        // Log environment variables (safely)
        console.log('Environment check:', {
            hasToken: !!token,
            hasChat: !!chatId,
            tokenLength: token?.length,
            chatIdLength: chatId?.length
        });

        if (!token || !chatId) {
            throw new Error('Missing Telegram configuration. Please check environment variables.');
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        console.log('Sending to Telegram URL:', url);

        const response = await axios.post(url, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Telegram API error:', error);
        throw error;
    }
};

export const handler: Handler = async (event) => {
    // Log incoming request details
    console.log('Function invoked:', {
        method: event.httpMethod,
        headers: event.headers,
        body: event.body?.substring(0, 200)
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