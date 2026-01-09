// Database initialization script for Railway
// This runs automatically on Railway deployment
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('📝 Running database migrations...');
    
    // Check if tables exist
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Run schema
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('✅ Schema applied!');

      // Run seed data
      const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✅ Seed data loaded!');
    } else {
      console.log('✅ Database already initialized');
    }

    await pool.end();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    // Don't exit - let the server start anyway
  }
}

// Run if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  initDatabase();
}

module.exports = initDatabase;
