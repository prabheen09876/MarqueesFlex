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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            {/* Add your admin panel content here */}
        </div>
    );
};

export default AdminPanel; 