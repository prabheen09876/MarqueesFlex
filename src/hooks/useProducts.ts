import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import type { Product } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        console.log('Fetched products:', fetchedProducts); // Debug log
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err); // Debug log
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (category: string) => {
    console.log('Filtering products for category:', category); // Debug log
    console.log('Available products:', products); // Debug log
    return products.filter(p => p.category === category);
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory
  };
}
