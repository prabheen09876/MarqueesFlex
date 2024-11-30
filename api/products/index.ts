import { getAllProducts, createProduct } from '../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  runtime: 'edge',
  regions: ['fra1']  // Specify the region closest to your users
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await getAllProducts();
      
      if (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
      
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { name, description, price, image, category } = req.body;

      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { data, error } = await createProduct({
        name,
        description,
        price: Number(price),
        image,
        category
      });

      if (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Failed to create product' });
      }

      return res.status(201).json(data[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
