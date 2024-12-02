import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb } from '../database.js';

const router = express.Router();

// Admin Registration
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = await getDb();
    
    // Check if username already exists
    const existingUser = await db.get('SELECT * FROM admins WHERE username = ?', username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert new admin
    await db.run(
      'INSERT INTO admins (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    console.log('Admin registered successfully:', username);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = await getDb();
    
    // Find admin by username
    const admin = await db.get('SELECT * FROM admins WHERE username = ?', username);
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', validPassword ? 'Yes' : 'No');
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    console.log('Login successful for:', username);
    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json(verified);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token: ' + error.message });
  }
});

export default router;