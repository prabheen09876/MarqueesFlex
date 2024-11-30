import { get, set } from '@vercel/edge-config';
import type { Request } from '@vercel/node';

export const config = {
  runtime: 'edge',
  regions: ['fra1']  // Specify the region closest to your users
};

export default async function handler(req: Request) {
  try {
    if (req.method === 'GET') {
      try {
        const products = await get('products') || [];
        return new Response(JSON.stringify(products), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        const { name, description, price, image, category } = body;

        if (!name || !description || !price || !image || !category) {
          return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
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

        const existingProducts = await get('products') || [];
        const updatedProducts = [...existingProducts, newProduct];
        await set('products', updatedProducts);

        return new Response(JSON.stringify(newProduct), {
          status: 201,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error creating product:', error);
        return new Response(JSON.stringify({ error: 'Failed to create product' }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
