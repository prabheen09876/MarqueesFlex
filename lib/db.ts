import { Pool } from 'pg';

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

export async function query({ query, values = [] }: { query: string; values?: any[] }) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, values);
    return { data: result.rows, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error: error.message };
  } finally {
    client.release();
  }
}

// Helper functions for products
export async function getAllProducts() {
  return query({
    query: 'SELECT * FROM products ORDER BY created_at DESC'
  });
}

export async function getProductById(id: string) {
  return query({
    query: 'SELECT * FROM products WHERE id = $1',
    values: [id]
  });
}

export async function createProduct({ name, description, price, image, category }: {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}) {
  return query({
    query: `
      INSERT INTO products (name, description, price, image, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    values: [name, description, price, image, category]
  });
}

export async function deleteProduct(id: string) {
  return query({
    query: 'DELETE FROM products WHERE id = $1 RETURNING *',
    values: [id]
  });
}
