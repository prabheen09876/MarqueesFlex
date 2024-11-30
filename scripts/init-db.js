import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const { Pool } = pg;

// Create a connection pool with direct credentials
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    console.log('Connecting to database...');
    console.log('Using host:', process.env.POSTGRES_HOST);
    const client = await pool.connect();
    console.log('Connected successfully!');
    
    try {
      console.log('Creating products table...');
      // Create products table
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          image VARCHAR(1024) NOT NULL,
          category VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('Database initialized successfully!');

      // Optional: Insert a test product
      await client.query(`
        INSERT INTO products (name, description, price, image, category)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [
        'Test LED Sign',
        'A beautiful LED sign for testing',
        99.99,
        'https://example.com/image.jpg',
        'Test Category'
      ]);
      
      console.log('Test product inserted successfully!');
      
      // Verify the table was created
      const { rows } = await client.query('SELECT COUNT(*) FROM products');
      console.log(`Number of products in database: ${rows[0].count}`);
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
