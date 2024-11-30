import { initializeDb } from './database.js';

async function init() {
  try {
    console.log('Initializing database...');
    await initializeDb();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

init();
