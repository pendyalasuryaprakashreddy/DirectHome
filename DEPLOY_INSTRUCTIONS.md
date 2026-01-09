# Quick Cloud Deployment Guide - Railway

## Deploy in 5 Minutes to Railway

Railway is the easiest way to deploy DirectHome with automatic database setup.

### Step 1: Prepare GitHub Repository

1. Initialize git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - DirectHome"
```

2. Create a new repository on GitHub (github.com)
3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/directhome.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign up/login (use GitHub)

2. Click **"New Project"** → **"Deploy from GitHub repo"**

3. Select your repository

4. Railway will auto-detect and start deploying

### Step 3: Add PostgreSQL Database

1. In your Railway project, click **"+ New"** → **"Database"** → **"Add PostgreSQL"**

2. Railway will automatically:
   - Create the database
   - Set `DATABASE_URL` environment variable
   - Connect it to your service

### Step 4: Configure Environment Variables

1. Go to your service → **"Variables"** tab

2. Add these variables:
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OTP_SECRET=your-super-secret-otp-key-change-this-in-production
NODE_ENV=production
PORT=5000
```

3. For the frontend, add:
```
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Step 5: Set Up Database

After deployment, you need to run migrations:

1. Go to your PostgreSQL database in Railway
2. Click **"Connect"** → **"PostgreSQL"** 
3. Copy the connection string
4. Run migrations locally (or use Railway's database console):

```bash
# Using Railway's database console or psql
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/seed.sql
```

**OR use Railway's Database Console:**
1. Click on your PostgreSQL service
2. Click **"Query"** tab
3. Copy and paste contents of `database/schema.sql` and run
4. Then copy and paste contents of `database/seed.sql` and run

### Step 6: Configure Custom Domain (Optional)

1. Go to your service → **"Settings"**
2. Click **"Generate Domain"** or add your custom domain
3. Your app will be available at: `https://your-app.up.railway.app`

### Step 7: Update Frontend API URL

Once you have your backend URL:
1. Update `NEXT_PUBLIC_API_URL` in Railway variables to your backend URL
2. Redeploy if needed

---

## Alternative: Deploy Frontend to Vercel + Backend to Railway

### Frontend (Vercel) - FREE

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"New Project"** → Import your GitHub repo
3. **Root Directory**: Select `frontend`
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps key
5. Deploy!

### Backend (Railway) - As above

---

## Quick Deploy Script

I'll create a script to help you deploy. Just run:

```bash
npm run deploy:railway
```

---

## Your Live URLs

After deployment:
- **Frontend**: `https://your-app.vercel.app` (or Railway URL)
- **Backend API**: `https://your-backend.up.railway.app`
- **Team URL**: Share the frontend URL

---

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is linked to your app in Railway
- Check `DATABASE_URL` is set correctly

### Build Failures
- Check logs in Railway dashboard
- Ensure all dependencies are in package.json

### CORS Errors
- Update `NEXT_PUBLIC_API_URL` to match your backend URL
- Check backend CORS settings

---

## Cost

- **Railway**: Free tier available (500 hours/month)
- **Vercel**: Free tier for frontend
- **Total**: FREE for small projects!
