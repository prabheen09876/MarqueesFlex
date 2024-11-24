import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });
  }
  return db;
}

export async function setupDatabase() {
  const db = await getDb();

  // Drop existing tables to reset schema
  await db.exec(`
    DROP TABLE IF EXISTS order_images;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products;
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

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS cart_sessions (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (session_id) REFERENCES cart_sessions (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  console.log('Database setup completed');
}