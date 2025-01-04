const getApiUrl = () => {
    if (import.meta.env.PROD) {
        return 'https://marqueesflex.netlify.app/.netlify/functions';
    }
    // For local development
    return '/.netlify/functions';
};

export const sendTelegramNotification = async (message: string) => {
    try {
        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/notify-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error('Telegram API Error:', data);
            throw new Error(data.error || 'Failed to send notification');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to send notification');
    }
}; 