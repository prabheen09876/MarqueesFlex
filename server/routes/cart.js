import express from 'express';
import { z } from 'zod';
import { getDb } from '../database.js';

const router = express.Router();

const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive()
});

// Create or update cart item
router.post('/:sessionId/items', async (req, res) => {
  try {
    const { productId, quantity } = cartItemSchema.parse(req.body);
    const db = await getDb();

    // Ensure session exists
    let session = await db.get('SELECT * FROM cart_sessions WHERE id = ?', req.params.sessionId);
    if (!session) {
      await db.run('INSERT INTO cart_sessions (id) VALUES (?)', req.params.sessionId);
    }

    // Check if product exists
    const product = await db.get('SELECT * FROM products WHERE id = ?', productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update or insert cart item
    const existingItem = await db.get(
      'SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?',
      [req.params.sessionId, productId]
    );

    if (existingItem) {
      await db.run(
        'UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?',
        [quantity, req.params.sessionId, productId]
      );
    } else {
      await db.run(
        'INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.params.sessionId, productId, quantity]
      );
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get cart items
router.get('/:sessionId/items', async (req, res) => {
  try {
    const db = await getDb();
    const items = await db.all(`
      SELECT ci.*, p.name, p.price, p.image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.session_id = ?
    `, req.params.sessionId);
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Remove cart item
router.delete('/:sessionId/items/:productId', async (req, res) => {
  try {
    const db = await getDb();
    await db.run(
      'DELETE FROM cart_items WHERE session_id = ? AND product_id = ?',
      [req.params.sessionId, req.params.productId]
    );
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

export default router;