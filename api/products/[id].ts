import { createClient } from '@vercel/edge-config';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge'
};

const edgeConfig = createClient(process.env.EDGE_CONFIG);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return new Response(JSON.stringify({ error: 'Invalid product ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const products = await edgeConfig.get('products') || [];
    const productIndex = products.findIndex((p: any) => p.id === id);

    if (productIndex === -1) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Remove the product from the array
    const updatedProducts = [
      ...products.slice(0, productIndex),
      ...products.slice(productIndex + 1)
    ];
    
    // Update the products in Edge Config
    await edgeConfig.set('products', updatedProducts);

    return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
