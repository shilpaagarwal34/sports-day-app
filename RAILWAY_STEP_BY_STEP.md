# Railway Deployment - Step by Step

## Step 1: Access Railway

1. **Open your browser**
2. **Go to**: https://railway.app
3. **Click**: "Start a New Project" or "Login"

## Step 2: Sign In

1. **Click**: "Login with GitHub"
2. **Authorize Railway** to access your GitHub account
3. You'll be redirected to Railway dashboard

## Step 3: Create New Project

1. **Click**: "New Project" button (top right corner, purple button)
2. **Select**: "Deploy from GitHub repo"
3. **You'll see a list of your repositories**
4. **Find and click**: `sports-day-app`
5. Railway will start deploying automatically

## Step 4: Monitor Deployment

You'll see:
- **Building...** - Installing dependencies
- **Deploying...** - Starting the server
- **Deployed** ✅ - Service is running

**Wait time**: 2-3 minutes

## Step 5: Get Your Backend URL

Once deployment is complete:

1. **Click on your service** (should be named `sports-day-app`)
2. **Go to "Settings" tab** (left sidebar)
3. **Scroll down to "Networking" section**
4. **You'll see**: "Generate Domain" button or a public URL
5. **Click "Generate Domain"** (if needed)
6. **Copy the URL** - It will look like:
   ```
   https://sports-day-app-production-xxxx.up.railway.app
   ```

## Step 6: Verify Start Command (Check)

1. In Settings tab, scroll to **"Start Command"**
2. **Should be**: `node server/index.js`
3. If it's different, **change it to**: `node server/index.js`
4. Click **"Save"** (if you changed it)

## Step 7: Test Your Backend

Open the Railway URL in your browser:
```
https://your-railway-url.up.railway.app/api/health
```

**Expected response:**
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

**Test other endpoints:**
- `https://your-railway-url.up.railway.app/api/teams`
- `https://your-railway-url.up.railway.app/api/players`
- `https://your-railway-url.up.railway.app/api/games`

## Step 8: Connect to Frontend (Vercel)

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your `sports-day-app` project

2. **Navigate to Environment Variables**
   - Click **"Settings"** (top menu)
   - Click **"Environment Variables"** (left sidebar)

3. **Add New Variable**
   - Click **"Add"** or **"Add New"** button
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL
   - **Environments**: Check all three boxes:
     - ☑ Production
     - ☑ Preview  
     - ☑ Development
   - Click **"Save"**

4. **Redeploy Frontend**
   - Go to **"Deployments"** tab
   - Find your latest deployment
   - Click the **three dots (⋯)** menu
   - Click **"Redeploy"**
   - Wait for deployment (1-2 minutes)

## Step 9: Test Complete Application

1. **Visit your Vercel frontend URL**
2. **Test each page:**
   - ✅ **Dashboard** - Should show statistics
   - ✅ **Players** - Should show all 13 players
   - ✅ **Games** - Should show all 10 games
   - ✅ **Add players to games** - Should work

## Visual Guide

### Railway Dashboard Layout:
```
┌─────────────────────────────────┐
│  Railway Dashboard              │
├─────────────────────────────────┤
│  [New Project] [Settings]       │
│                                  │
│  Your Projects:                  │
│  ┌──────────────────────────┐   │
│  │ sports-day-app           │   │
│  │ ● Deployed               │   │
│  │ https://...railway.app   │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Settings Tab:
```
Settings
├── General
├── Variables
├── Networking  ← Your URL is here
└── Start Command  ← Should be: node server/index.js
```

## Troubleshooting

### Issue: Can't find repository
- **Solution**: Make sure you're logged in with the correct GitHub account
- Refresh the page and try again

### Issue: Build fails
- **Solution**: 
  - Check Railway logs for errors
  - Verify all dependencies are in `package.json`
  - Check that `server/index.js` exists

### Issue: Service won't start
- **Solution**:
  - Go to Settings → Start Command
  - Ensure it's: `node server/index.js`
  - Check logs for error messages

### Issue: Can't find URL
- **Solution**:
  - Go to Settings → Networking
  - Click "Generate Domain" if no URL is shown
  - The URL appears after first successful deployment

## What Happens Automatically

✅ Railway detects Node.js
✅ Reads `railway.json` configuration
✅ Installs dependencies (`npm install`)
✅ Starts server (`node server/index.js`)
✅ Generates public URL
✅ Database initializes in `/tmp` directory

## Quick Checklist

- [ ] Logged into Railway
- [ ] Created new project from GitHub
- [ ] Selected `sports-day-app` repository
- [ ] Deployment completed successfully
- [ ] Copied Railway backend URL
- [ ] Tested backend (health endpoint works)
- [ ] Added `REACT_APP_API_URL` to Vercel
- [ ] Redeployed frontend on Vercel
- [ ] Tested full application

## Your Repository

**GitHub**: https://github.com/shilpaagarwal34/sports-day-app

Railway will automatically:
- Clone your repository
- Detect Node.js
- Install dependencies
- Start your server
- Provide a public URL

---

**Ready?** Go to https://railway.app and start deploying! 🚀
