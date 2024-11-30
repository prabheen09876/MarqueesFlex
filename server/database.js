import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite'
  : join(__dirname, 'database.sqlite');

let db;

export async function getDb() {
  if (!db) {
    try {
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      
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

    // Create orders table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        notes TEXT,
        items TEXT,
        total REAL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        description TEXT,
        images TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}