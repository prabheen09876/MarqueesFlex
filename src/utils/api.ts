export const sendTelegramNotification = async (message: string) => {
    try {
        // Try the new endpoint first
        const response = await fetch('/.netlify/functions/notify-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error('Failed to send notification');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to send notification');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}; 