import { useEffect } from 'react';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check authentication status
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                // Redirect to login if not authenticated
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleUpdateProduct = async (productId: string, productData: any) => {
        try {
            // Make sure user is still authenticated
            if (!auth.currentUser) {
                throw new Error('You must be logged in to update products');
            }

            await updateProduct(productId, productData);
            // Handle success
        } catch (error) {
            console.error('Error updating product:', error);
            // Handle error (show toast notification, etc.)
        }
    };

    // Rest of your component code...
}; 