import { getDb } from '../../server/database.js';

export default async function handler(req: any, res: any) {
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

  const db = await getDb();

  switch (req.method) {
    case 'GET':
      try {
        const products = await db.all('SELECT * FROM products');
        res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
      }
      break;

    case 'POST':
      try {
        const { name, description, collection, imageUrl, price } = req.body;
        
        if (!name || !description || !collection || !imageUrl || !price) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.run(
          `INSERT INTO products (name, description, collection, image_url, price)
           VALUES (?, ?, ?, ?, ?)`,
          [name, description, collection, imageUrl, price]
        );

        res.status(201).json({
          id: result.lastID,
          name,
          description,
          collection,
          imageUrl,
          price
        });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
      }
      break;

    case 'DELETE':
      try {
        const productId = req.query.id;
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        await db.run('DELETE FROM products WHERE id = ?', [productId]);
        res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
