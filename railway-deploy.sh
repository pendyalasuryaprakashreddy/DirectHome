#!/bin/bash

# Railway Deployment Helper Script

echo "🚂 Railway Deployment Helper"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - DirectHome ready for deployment"
    echo "✅ Git initialized"
    echo ""
fi

echo "📋 Deployment Checklist:"
echo ""
echo "1. ✅ Push code to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/directhome.git"
echo "   git push -u origin main"
echo ""
echo "2. 🌐 Go to https://railway.app and:"
echo "   - Sign up/login with GitHub"
echo "   - Click 'New Project' → 'Deploy from GitHub repo'"
echo "   - Select your repository"
echo ""
echo "3. 🗄️  Add PostgreSQL database:"
echo "   - Click '+ New' → 'Database' → 'Add PostgreSQL'"
echo ""
echo "4. ⚙️  Set environment variables in Railway:"
echo "   JWT_SECRET=your-secret-key"
echo "   OTP_SECRET=your-otp-secret"
echo "   NODE_ENV=production"
echo ""
echo "5. 📊 Run database migrations:"
echo "   - Use Railway's database console"
echo "   - Run database/schema.sql"
echo "   - Run database/seed.sql"
echo ""
echo "6. 🔗 Get your deployment URL from Railway dashboard"
echo ""
echo "📖 See DEPLOY_INSTRUCTIONS.md for detailed steps"
echo ""
