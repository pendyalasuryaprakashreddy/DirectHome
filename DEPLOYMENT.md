# DirectHome Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- npm or yarn

### Step 1: Database Setup

1. Create PostgreSQL database:
```bash
createdb directhome
# Or using psql:
psql -U postgres -c "CREATE DATABASE directhome;"
```

2. Run database migrations:
```bash
cd database
psql -U postgres -d directhome -f schema.sql
psql -U postgres -d directhome -f seed.sql
```

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/directhome
JWT_SECRET=your-secret-key-change-in-production
OTP_SECRET=your-otp-secret-change-in-production
NODE_ENV=development
```

4. Install dependencies and start:
```bash
npm install
npm run dev
```

Backend will run on http://localhost:5000

### Step 3: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

4. Install dependencies and start:
```bash
npm install
npm run dev
```

Frontend will run on http://localhost:3000

### Step 4: Create Upload Directories

```bash
mkdir -p backend/uploads/properties
mkdir -p backend/uploads/documents
```

## Vercel Deployment

### Frontend Deployment

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com) and import your repository

3. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (or use Vercel serverless functions)
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

4. Deploy!

### Backend Deployment Options

#### Option 1: Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Add Node.js service from GitHub
5. Set environment variables:
   - `DATABASE_URL`: Provided by Railway PostgreSQL
   - `JWT_SECRET`: Your secret key
   - `OTP_SECRET`: Your OTP secret
   - `NODE_ENV`: production
   - `PORT`: Railway will set this automatically

#### Option 2: Render

1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add PostgreSQL database
7. Set environment variables

#### Option 3: AWS/Heroku

Similar process - deploy Node.js app and connect PostgreSQL database.

### Database Migration on Production

Run the schema and seed files on your production database:

```bash
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql
```

## Environment Variables Summary

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT tokens
- `OTP_SECRET`: Secret for OTP generation
- `NODE_ENV`: development or production

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key

## Demo Accounts

After seeding the database, you can use these accounts:

- **Buyer**: Phone: +919876543210, OTP: 123456
- **Seller**: Phone: +919876543211, OTP: 123456
- **Admin**: Phone: +919876543212, OTP: 123456

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Verify database exists

### CORS Issues
- Ensure backend CORS is configured correctly
- Check NEXT_PUBLIC_API_URL matches backend URL

### File Upload Issues
- Ensure upload directories exist
- Check file permissions
- Verify multer configuration

### Google Maps Not Loading
- Verify API key is correct
- Check API key restrictions
- Ensure billing is enabled on Google Cloud

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Change OTP_SECRET to a strong random string
- [ ] Set up proper SMS service for OTP (Twilio, etc.)
- [ ] Configure file storage (S3, Cloudinary, etc.)
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up backup strategy for database
- [ ] Review and update security settings
