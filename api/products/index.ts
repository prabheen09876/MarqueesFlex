import { createClient } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge'
};

const edgeConfig = createClient(process.env.EDGE_CONFIG);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        try {
          const products = await edgeConfig.get('products') || [];
          return new Response(JSON.stringify(products), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error fetching products:', error);
          return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      case 'POST':
        try {
          const body = await req.json();
          const { name, description, price, image, category } = body;

          if (!name || !description || !price || !image || !category) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            price,
            image,
            category,
            created_at: new Date().toISOString()
          };

          const existingProducts = await edgeConfig.get('products') || [];
          const updatedProducts = [...existingProducts, newProduct];
          await edgeConfig.set('products', updatedProducts);

          return new Response(JSON.stringify(newProduct), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Error creating product:', error);
          return new Response(JSON.stringify({ error: 'Failed to create product' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
