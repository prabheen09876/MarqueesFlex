import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Check authentication status
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                // Redirect to login if not authenticated
                navigate('/login');
            } else {
                // Fetch categories if authenticated
                fetchCategories();
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const fetchCategories = async () => {
        try {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        }
    };

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

export default AdminPanel; 