import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
  regions: ['fra1']  // Specify the region closest to your users
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // First check if the product exists
    const { rows } = await sql`
      SELECT id FROM products WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete the product
    await sql`
      DELETE FROM products WHERE id = ${id}
    `;

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}
