import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db;

export async function initializeDb() {
  if (db) return db;
  
  const dbPath = join(__dirname, 'database.sqlite');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create products table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      collection TEXT NOT NULL,
      image_url TEXT NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

export async function getDb() {
  if (!db) {
    db = await initializeDb();
  }
  return db;
}

export async function setupDatabase() {
  const db = await getDb();

  // Drop existing tables to reset schema
  await db.exec(`
    DROP TABLE IF EXISTS order_images;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_sessions;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS admins;
  `);

  // Create tables with updated schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      description TEXT,
      address TEXT,
      notes TEXT,
      items TEXT,
      total REAL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (session_id) REFERENCES cart_sessions (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  console.log('Database setup completed');
}