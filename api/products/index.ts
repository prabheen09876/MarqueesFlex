import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  runtime: 'edge',
  regions: ['fra1']  // Specify the region closest to your users
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT * FROM products 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, description, price, image, category } = req.body;

      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const { rows } = await sql`
        INSERT INTO products (name, description, price, image, category)
        VALUES (${name}, ${description}, ${price}, ${image}, ${category})
        RETURNING *
      `;

      return res.status(201).json(rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error', details: error.message });
  }
}
