# DirectHome - Buy & Sell Homes Directly

**Tagline**: Buy & Sell Homes Directly — No Brokers, No Commission, No Scams

A peer-to-peer real estate marketplace where verified owners list second-hand residential properties and buyers interact directly without brokers.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, 21.dev UI components, Google Maps
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL
- **Deployment**: Vercel (ready) + Local development

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Quick Setup

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Set up PostgreSQL database:**
```bash
# Create database
createdb directhome

# Or using psql:
psql -U postgres -c "CREATE DATABASE directhome;"
```

3. **Run database migrations:**
```bash
cd database
psql -U postgres -d directhome -f schema.sql
psql -U postgres -d directhome -f seed.sql
```

4. **Configure environment variables:**

Create `backend/.env` (copy from `backend/.env.example`):
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/directhome
JWT_SECRET=your-secret-key-change-in-production
OTP_SECRET=your-otp-secret-change-in-production
NODE_ENV=development
```

Create `frontend/.env.local` (copy from `frontend/.env.local.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

**Note:** For Google Maps, get a free API key from [Google Cloud Console](https://console.cloud.google.com/). The app will work without it, but map features won't function.

5. **Create upload directories:**
```bash
mkdir -p backend/uploads/properties
mkdir -p backend/uploads/documents
```

6. **Start development servers:**
```bash
npm run dev
```

This will start both frontend and backend concurrently:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Or start them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Features

- ✅ OTP-based authentication
- ✅ Property listings with images/videos
- ✅ Advanced search & filters
- ✅ Map view with Google Maps
- ✅ In-app messaging
- ✅ Seller verification system
- ✅ AI-powered fraud detection (mock)
- ✅ Admin panel

## Project Structure

```
directhome/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── database/          # SQL schema and seeds
└── README.md
```

## Demo Accounts

After running the seed script, you can login with these accounts:

- **Buyer**: Phone: +919876543210, OTP: 123456
- **Seller**: Phone: +919876543211, OTP: 123456  
- **Admin**: Phone: +919876543212, OTP: 123456

**Note:** For demo purposes, OTP is set to `123456` for all numbers. In production, this would be sent via SMS.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Vercel Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
4. Deploy!

**Note:** You'll need to deploy the backend separately (Railway, Render, AWS, etc.) and update the `NEXT_PUBLIC_API_URL` accordingly.

## License

MIT
