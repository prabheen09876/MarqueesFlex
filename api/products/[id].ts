import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../server/database.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const db = await getDb();
    
    // First check if the product exists
    const product = await db.get('SELECT id FROM products WHERE id = ?', id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await db.run('DELETE FROM products WHERE id = ?', id);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
}
