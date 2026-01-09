#!/bin/bash

# DirectHome Setup Script

echo "🚀 Setting up DirectHome..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p backend/uploads/properties
mkdir -p backend/uploads/documents

# Copy environment files
echo "⚙️  Setting up environment files..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env - Please update with your database credentials"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Created frontend/.env.local - Please update with your API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database:"
echo "   createdb directhome"
echo ""
echo "2. Run database migrations:"
echo "   cd database && psql -U postgres -d directhome -f schema.sql"
echo "   psql -U postgres -d directhome -f seed.sql"
echo ""
echo "3. Update backend/.env with your database credentials"
echo "4. Update frontend/.env.local with your Google Maps API key (optional)"
echo ""
echo "5. Start the development servers:"
echo "   npm run dev"
echo ""
