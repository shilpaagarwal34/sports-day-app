# Railway Backend Deployment Guide

Step-by-step guide to deploy your Express backend to Railway.

## Prerequisites

- GitHub account
- Code pushed to GitHub repository
- Railway account (free tier available)

## Step-by-Step Instructions

### Step 1: Push Code to GitHub

If you haven't already:

```bash
# Check if git is initialized
git status

# If not initialized, initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Railway deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/your-username/sports-day-app.git

# Push to GitHub
git push -u origin main
```

### Step 2: Sign Up for Railway

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Start a New Project"

2. **Sign In**
   - Click "Login with GitHub"
   - Authorize Railway to access your GitHub account
   - Grant necessary permissions

### Step 3: Create New Project

1. **Click "New Project"** (top right corner)

2. **Select "Deploy from GitHub repo"**
   - You'll see a list of your GitHub repositories
   - Find and select `sports-day-app` (or your repository name)
   - Click on it

3. **Railway will start deploying automatically**
   - You'll see a build log
   - Wait for the initial deployment

### Step 4: Configure the Service

After the initial deployment:

1. **Click on your service** (should be named after your repo)

2. **Go to Settings Tab**

3. **Configure Start Command**
   - Scroll down to "Start Command"
   - Set it to: `node server/index.js`
   - Click "Save"

4. **Configure Root Directory** (if needed)
   - Usually Railway detects it correctly
   - If not, set to: `/` (root directory)

### Step 5: Get Your Backend URL

1. **Go to the Settings tab** (or Deployments tab)

2. **Find "Networking" section** or **"Generate Domain"**

3. **Click "Generate Domain"** (if available)
   - Railway will create a public URL like: `https://sports-day-app-production.up.railway.app`

4. **Copy the URL**
   - This is your backend API URL
   - Example: `https://sports-day-app-production.up.railway.app`

### Step 6: Test Your Backend

1. **Open a browser or use curl**
   ```bash
   curl https://your-railway-url.up.railway.app/api/health
   ```

2. **Should return:**
   ```json
   {"status":"ok","message":"Sports Day Management API is running"}
   ```

3. **Test other endpoints:**
   ```bash
   # Test teams endpoint
   curl https://your-railway-url.up.railway.app/api/teams
   
   # Test players endpoint
   curl https://your-railway-url.up.railway.app/api/players
   
   # Test games endpoint
   curl https://your-railway-url.up.railway.app/api/games
   ```

### Step 7: Update Frontend to Use Backend URL

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your `sports-day-app` project

2. **Go to Settings → Environment Variables**

3. **Add New Environment Variable:**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL
   - **Environment**: Select "Production", "Preview", and "Development"
   - Click "Save"

4. **Redeploy Frontend:**
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete

### Step 8: Verify Everything Works

1. **Visit your Vercel frontend URL:**
   - Example: `https://sports-day-jkutr30ej-shilpaagarwal34-8597s-projects.vercel.app`

2. **Test the application:**
   - Click on "Dashboard" - should load data from backend
   - Click on "Players" - should show players from backend
   - Click on "Games" - should show games from backend

3. **If you see data loading:**
   - ✅ Backend is connected correctly!
   - ✅ Deployment successful!

## Troubleshooting

### Issue: Build Fails

**Solution:**
- Check Railway build logs
- Ensure `package.json` has all dependencies
- Verify `server/index.js` exists and is correct

### Issue: Service Won't Start

**Solution:**
- Check "Start Command" is set to: `node server/index.js`
- Verify PORT is set correctly (Railway provides it automatically)
- Check logs in Railway dashboard

### Issue: API Returns 404

**Solution:**
- Ensure URL includes `/api` prefix
- Check that routes are configured correctly
- Verify backend is running (check Railway logs)

### Issue: Database Errors

**Solution:**
- SQLite on Railway uses `/tmp` directory (already configured)
- Database is ephemeral (resets on redeploy)
- For production persistence, consider migrating to PostgreSQL

### Issue: CORS Errors

**Solution:**
- Backend already has CORS enabled
- If issues persist, check Railway logs
- Verify `cors()` middleware is applied

## Railway Dashboard Overview

### Key Sections:

1. **Deployments Tab:**
   - See all deployments
   - View deployment logs
   - Rollback if needed

2. **Settings Tab:**
   - Environment Variables
   - Start Command
   - Root Directory
   - Networking (Domain)

3. **Metrics Tab:**
   - CPU Usage
   - Memory Usage
   - Request Count

4. **Logs Tab:**
   - Real-time application logs
   - Build logs
   - Error logs

## Environment Variables (Optional)

If you need to add environment variables in Railway:

1. Go to your service → Settings → Variables
2. Click "New Variable"
3. Add variables as needed
4. Redeploy service

## Database Considerations

### Current Setup:
- Uses SQLite in `/tmp` directory
- Data is ephemeral (lost on redeploy/cold start)

### For Production:
Consider migrating to:
- **Railway Postgres** (Recommended)
  - Go to Railway → New → Database → PostgreSQL
  - Update `server/database.js` to use PostgreSQL instead of SQLite

- **Supabase** (Free tier available)
- **MongoDB Atlas** (Free tier available)

## Railway Pricing

- **Free Tier**: $5 credit/month (usually enough for small apps)
- **Hobby Plan**: $5/month (more resources)
- **Pro Plan**: $20/month (production-ready)

## Useful Railway Commands (CLI)

Install Railway CLI:
```bash
npm i -g @railway/cli
```

Login:
```bash
railway login
```

Link project:
```bash
railway link
```

View logs:
```bash
railway logs
```

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Start command set to `node server/index.js`
- [ ] Public URL generated
- [ ] Backend tested (health endpoint works)
- [ ] Frontend environment variable updated (`REACT_APP_API_URL`)
- [ ] Frontend redeployed
- [ ] Full application tested

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

## Your Backend URL Format

Once deployed, your Railway URL will look like:
```
https://sports-day-app-production-xxxx.up.railway.app
```

Use this as your `REACT_APP_API_URL` value in Vercel:
```
https://sports-day-app-production-xxxx.up.railway.app/api
```

---

**Need help?** Railway has excellent documentation and a helpful Discord community!
