import express from 'express';
import { getDb } from '../database.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});


// Create new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const db = await getDb();
    
    const result = await db.run(
      'INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image, category]
    );
    
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', result.lastID);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    const db = await getDb();
    
    // Check if product exists
    const existingProduct = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await db.run(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ? WHERE id = ?',
      [name, description, price, image, category, req.params.id]
    );
    
    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    
    // Check if product exists
    const existingProduct = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await db.run('DELETE FROM products WHERE id = ?', req.params.id);
    res.json({ message: 'Product deleted successfully', deletedProduct: existingProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
export default router;