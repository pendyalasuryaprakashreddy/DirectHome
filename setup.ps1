# DirectHome Setup Script for Windows

Write-Host "🚀 Setting up DirectHome..." -ForegroundColor Cyan

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Create upload directories
Write-Host "📁 Creating upload directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "backend\uploads\properties" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\uploads\documents" | Out-Null

# Copy environment files
Write-Host "⚙️  Setting up environment files..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "✅ Created backend/.env - Please update with your database credentials" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\.env.local.example" "frontend\.env.local"
    Write-Host "✅ Created frontend/.env.local - Please update with your API keys" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Set up PostgreSQL database:"
Write-Host "   createdb directhome"
Write-Host ""
Write-Host "2. Run database migrations:"
Write-Host "   cd database; psql -U postgres -d directhome -f schema.sql"
Write-Host "   psql -U postgres -d directhome -f seed.sql"
Write-Host ""
Write-Host "3. Update backend/.env with your database credentials"
Write-Host "4. Update frontend/.env.local with your Google Maps API key (optional)"
Write-Host ""
Write-Host "5. Start the development servers:"
Write-Host "   npm run dev"
Write-Host ""
