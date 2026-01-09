# Quick Start Guide

Get DirectHome running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL installed and running (`psql --version`)
- [ ] npm installed (`npm --version`)

## Step-by-Step Setup

### 1. Install Dependencies

**Windows:**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Or manually:**
```bash
npm run install:all
```

### 2. Database Setup

```bash
# Create database
createdb directhome

# Run migrations
cd database
psql -U postgres -d directhome -f schema.sql
psql -U postgres -d directhome -f seed.sql
cd ..
```

### 3. Environment Configuration

**Backend** (`backend/.env`):
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/directhome
JWT_SECRET=change-this-secret-key
OTP_SECRET=change-this-otp-secret
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
```

> **Note:** Google Maps API key is optional for basic functionality. Get one from [Google Cloud Console](https://console.cloud.google.com/).

### 4. Create Upload Directories

```bash
mkdir -p backend/uploads/properties
mkdir -p backend/uploads/documents
```

### 5. Start the Application

```bash
npm run dev
```

This starts both frontend and backend. Open http://localhost:3000 in your browser.

## Test the Application

1. **Login as Buyer:**
   - Phone: `+919876543210`
   - OTP: `123456`

2. **Login as Seller:**
   - Phone: `+919876543211`
   - OTP: `123456`

3. **Login as Admin:**
   - Phone: `+919876543212`
   - OTP: `123456`

## Features to Test

- ✅ Browse properties on homepage
- ✅ Search and filter properties
- ✅ View property details
- ✅ Create new listing (as seller)
- ✅ Send messages to sellers
- ✅ Upload verification documents
- ✅ Admin dashboard (approve properties, verify documents)

## Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `backend/.env`
- Ensure database exists: `psql -l | grep directhome`

### Port Already in Use
- Change PORT in `backend/.env`
- Update `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

### Images Not Loading
- Ensure upload directories exist
- Check file permissions
- Verify backend is serving static files from `/uploads`

### CORS Errors
- Ensure backend CORS is enabled (already configured)
- Check `NEXT_PUBLIC_API_URL` matches backend URL

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize the application for your needs

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database migrations ran successfully
4. Check that both servers are running

Happy coding! 🚀
