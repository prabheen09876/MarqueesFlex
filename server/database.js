import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite'
  : join(__dirname, 'database.sqlite');

console.log('Database path:', dbPath);

let db;

export async function getDb() {
  if (!db) {
    try {
      console.log('Opening database connection...');
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      console.log('Database connection established');
      
      // Initialize database schema
      await setupDatabase();
    } catch (error) {
      console.error('Failed to open database:', error);
      throw error;
    }
  }
  return db;
}

export async function setupDatabase() {
  try {
    const db = await getDb();
    console.log('Setting up database tables...');
    
    // Create admins table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Admins table created/verified');

    // Verify if admin exists
    const adminCount = await db.get('SELECT COUNT(*) as count FROM admins');
    console.log('Current admin count:', adminCount.count);

    // Create products table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table created/verified');

    // Create orders table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Orders table created/verified');

    // Create order_items table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);
    console.log('Order items table created/verified');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}