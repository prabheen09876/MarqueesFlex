export const sendTelegramNotification = async (message: string) => {
    try {
        const response = await fetch('/.netlify/functions/notify-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || 'Failed to send notification');
        }

        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 