# 🚀 Quick Deploy to Cloud - Get Your URL in 10 Minutes

## Step-by-Step Deployment

### Option 1: Railway (Recommended - Easiest) ⭐

Railway is the fastest way to deploy with automatic database setup.

#### 1. Push Code to GitHub

```bash
git init
git add .
git commit -m "DirectHome ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/directhome.git
git push -u origin main
```

#### 2. Deploy to Railway

1. Go to **[railway.app](https://railway.app)** and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `directhome` repository
4. Railway will automatically start deploying!

#### 3. Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically links it and sets `DATABASE_URL`

#### 4. Set Environment Variables

Go to your service → **"Variables"** tab and add:

```
JWT_SECRET=directhome-secret-key-2024-change-this
OTP_SECRET=directhome-otp-secret-2024-change-this
NODE_ENV=production
PORT=5000
```

#### 5. Initialize Database

1. Click on your **PostgreSQL** service in Railway
2. Go to **"Query"** tab
3. Copy entire contents of `database/schema.sql` and paste → Run
4. Copy entire contents of `database/seed.sql` and paste → Run

#### 6. Get Your URL!

1. Click on your main service → **"Settings"**
2. Click **"Generate Domain"** 
3. Your app URL: `https://your-app.up.railway.app`
4. **Share this URL with your team!** 🎉

---

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel (FREE):**

1. Go to **[vercel.com](https://vercel.com)** and sign up
2. Click **"New Project"** → Import your GitHub repo
3. **Root Directory**: `frontend`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: (Optional)
5. Deploy!

**Backend on Railway:** Follow steps above for Railway

---

## 🎯 After Deployment

Your team can access:
- **Frontend URL**: `https://your-app.up.railway.app` or Vercel URL
- **Demo Accounts**: 
  - Buyer: `+919876543210` / OTP: `123456`
  - Seller: `+919876543211` / OTP: `123456`
  - Admin: `+919876543212` / OTP: `123456`

---

## ⚡ Quick Commands

```bash
# See deployment help
npm run deploy:help

# Or
node railway-deploy.js
```

---

## 💰 Cost

- **Railway**: Free tier (500 hours/month) - Perfect for demos!
- **Vercel**: Free tier for frontend
- **Total Cost**: $0 for small projects! 🎉

---

## 🆘 Troubleshooting

**Database not working?**
- Check `DATABASE_URL` is set in Railway variables
- Verify PostgreSQL service is linked to your app

**Can't access the site?**
- Check deployment logs in Railway dashboard
- Ensure PORT is set correctly

**Need help?**
- Check Railway logs: Service → "Deployments" → Click latest → "View Logs"
- Check `DEPLOY_INSTRUCTIONS.md` for detailed guide

---

## 📝 Notes

- Railway auto-deploys on every git push
- Database is automatically backed up
- Free tier is perfect for demos and small teams
- Upgrade only if you need more resources

**Your URL will be ready in ~5-10 minutes!** 🚀
