# Backend Deployment Guide

You have multiple options to deploy your Express backend. Here are the recommended approaches:

## Option 1: Deploy to Railway (Recommended - Easiest)

Railway is great for Node.js apps with SQLite databases.

### Steps:

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - Railway will auto-detect it's a Node.js app
   - Set these in the Variables tab:
     - `PORT`: `5000` (Railway will override with their port, but good to have)
   
4. **Configure Build Settings**
   - **Root Directory**: Leave as root
   - **Build Command**: `npm install` (default)
   - **Start Command**: `node server/index.js`

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete

6. **Get Backend URL**
   - Once deployed, Railway provides a public URL
   - Example: `https://your-app.railway.app`

7. **Update Frontend**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-app.railway.app/api`
   - Redeploy frontend

## Option 2: Deploy to Render

### Steps:

1. **Go to Render**
   - Visit [render.com](https://render.com)
   - Sign up/Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `sports-day-backend` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free tier available

4. **Environment Variables** (if needed)
   - Add `PORT`: `5000` (optional, Render provides it)

5. **Deploy**
   - Click "Create Web Service"
   - Render will deploy automatically

6. **Get Backend URL**
   - Render provides a URL like: `https://your-app.onrender.com`

7. **Update Frontend**
   - In Vercel: Add environment variable `REACT_APP_API_URL` = `https://your-app.onrender.com/api`
   - Redeploy frontend

## Option 3: Deploy to Fly.io

### Steps:

1. **Install Fly CLI**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Create Fly App**
   ```bash
   fly launch
   ```

4. **Follow prompts**
   - App name
   - Region
   - Database: Skip for now (using SQLite)

5. **Deploy**
   ```bash
   fly deploy
   ```

## Option 4: Convert to Vercel Serverless Functions

This requires converting your Express routes to Vercel serverless functions.

### Create API routes structure:

You'll need to convert each Express route to a serverless function in the `api/` directory.

Would you like me to help convert your Express routes to Vercel serverless functions?

## Quick Railway Deployment (Easiest)

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. Deploy (no configuration needed!)
7. Copy the public URL
8. Add to Vercel: `REACT_APP_API_URL` = `your-railway-url/api`

## Environment Variables Summary

### For Railway/Render/Fly.io (Backend):
- None required (PORT is auto-provided)

### For Vercel (Frontend):
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.railway.app/api`)

## Testing Backend

After deployment, test your backend:
```bash
curl https://your-backend-url/api/health
```

Should return:
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

## Database Note

⚠️ SQLite files are ephemeral on most platforms. For production persistence, consider:
- Railway: Provides persistent volumes
- Render: Files persist but may reset on deploys
- Fly.io: Volumes available for persistence
- Or migrate to PostgreSQL/MySQL/MongoDB
