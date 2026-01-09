-- DirectHome Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    role VARCHAR(20) DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
    verified BOOLEAN DEFAULT FALSE,
    trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    bhk INTEGER NOT NULL CHECK (bhk > 0),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    address TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    amenities JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive', 'pending_review')),
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property images/videos
CREATE TABLE IF NOT EXISTS property_media (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video', 'floor_plan')),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table (for verification)
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('id_proof', 'ownership', 'other')),
    file_path VARCHAR(500) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    verified_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    spam_score INTEGER DEFAULT 0 CHECK (spam_score >= 0 AND spam_score <= 100),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    filters JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bhk ON properties(bhk);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON documents(property_id);
