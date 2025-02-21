import { Handler } from '@netlify/functions';
import axios from 'axios';

// Hardcode the values for testing
const token = "7765791698:AAEdPdmRYZ3aHiwD0e8hUDmX72grWM1zTNA";
const chatId = "1157438477";

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

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
        } else {
            console.error('Error:', error);
        }
        throw error;
    }
};

export const handler: Handler = async (event) => {
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

        const body = JSON.parse(event.body || '{}');
        const message = body.message;

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