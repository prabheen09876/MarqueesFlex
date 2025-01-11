const getApiUrl = () => {
    if (import.meta.env.PROD) {
        return 'https://marqueesflex.netlify.app/.netlify/functions';
    }
    return 'http://localhost:8888/.netlify/functions';
};

export const sendTelegramNotification = async (message: string) => {
    try {
        console.log('Sending notification:', { message });

        const baseUrl = getApiUrl();
        const response = await fetch(`${baseUrl}/notify-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        // First get the raw response text
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Try to parse it as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (error) {
            console.error('Failed to parse response:', responseText);
            throw new Error('Invalid server response');
        }

        if (!response.ok || !data.success) {
            console.error('API Error Response:', data);
            throw new Error(data.error || 'Failed to send notification');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unknown error occurred');
    }
}; 