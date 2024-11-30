import { getDb } from '../../server/database.js';

export default async function handler(req, res) {
  const db = await getDb();

  switch (req.method) {
    case 'GET':
      try {
        const products = await db.all('SELECT * FROM products');
        return res.status(200).json(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }

    case 'POST':
      try {
        const { name, description, price, image, category } = req.body;

        if (!name || !description || !price || !image || !category) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await db.run(
          `INSERT INTO products (name, description, price, image, category) 
           VALUES (?, ?, ?, ?, ?)`,
          [name, description, price, image, category]
        );

        const newProduct = {
          id: result.lastID,
          name,
          description,
          price,
          image,
          category
        };

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

        await db.run('DELETE FROM products WHERE id = ?', id);
        return res.status(200).json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ error: 'Failed to delete product' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
