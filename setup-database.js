// Database Setup Script
// This script helps set up the PostgreSQL database

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
const DB_NAME = 'directhome';

async function setupDatabase() {
  console.log('🔧 Setting up DirectHome database...\n');

  // Connect to postgres database to create our database
  const adminPool = new Pool({
    connectionString: DATABASE_URL.replace('/directhome', '/postgres'),
  });

  try {
    // Check if database exists
    const dbCheck = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`📦 Creating database '${DB_NAME}'...`);
      await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log('✅ Database created!\n');
    } else {
      console.log(`✅ Database '${DB_NAME}' already exists\n`);
    }

    await adminPool.end();

    // Connect to our database to run migrations
    const pool = new Pool({
      connectionString: DATABASE_URL,
    });

    // Read and execute schema
    console.log('📝 Running schema migrations...');
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Schema applied!\n');

    // Read and execute seed data
    console.log('🌱 Seeding database with demo data...');
    const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
    await pool.query(seed);
    console.log('✅ Seed data loaded!\n');

    await pool.end();

    console.log('🎉 Database setup complete!');
    console.log('\nDemo accounts:');
    console.log('  Buyer:  +919876543210 (OTP: 123456)');
    console.log('  Seller: +919876543211 (OTP: 123456)');
    console.log('  Admin:  +919876543212 (OTP: 123456)');
  } catch (error) {
    console.error('\n❌ Database setup failed!');
    console.error('Error:', error.message);
    console.log('\nPlease ensure:');
    console.log('  1. PostgreSQL is installed and running');
    console.log('  2. PostgreSQL is accessible at:', DATABASE_URL);
    console.log('  3. User has permission to create databases');
    console.log('\nIf PostgreSQL is not installed:');
    console.log('  Windows: Download from https://www.postgresql.org/download/windows/');
    console.log('  Or use Docker: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres');
    process.exit(1);
  }
}

setupDatabase();
