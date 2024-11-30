import { getDb } from '../../server/database.js';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const db = await getDb();

    switch (req.method) {
      case 'GET':
        try {
          const products = await db.all('SELECT * FROM products ORDER BY created_at DESC');
          return res.status(200).json(products);
        } catch (error) {
          console.error('Error fetching products:', error);
          return res.status(500).json({ error: 'Failed to fetch products' });
        }

      case 'POST':
        try {
          const { name, description, collection, imageUrl, price } = req.body;
          
          if (!name || !description || !collection || !imageUrl || price === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
          }

          const result = await db.run(
            `INSERT INTO products (name, description, collection, image_url, price)
             VALUES (?, ?, ?, ?, ?)`,
            [name, description, collection, imageUrl, price]
          );

          const newProduct = await db.get('SELECT * FROM products WHERE id = ?', result.lastID);
          return res.status(201).json(newProduct);
        } catch (error) {
          console.error('Error creating product:', error);
          return res.status(500).json({ error: 'Failed to create product' });
        }

      case 'DELETE':
        try {
          const { id } = req.query;
          if (!id) {
            return res.status(400).json({ error: 'Product ID is required' });
          }

          await db.run('DELETE FROM products WHERE id = ?', [id]);
          return res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
          console.error('Error deleting product:', error);
          return res.status(500).json({ error: 'Failed to delete product' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
