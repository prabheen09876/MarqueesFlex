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

        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error('Failed to parse JSON response:', error);
            throw new Error('Invalid server response');
        }

        if (!response.ok || !data.success) {
            console.error('API Error Response:', data);
            throw new Error(data.error || 'Failed to send notification');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 