# Vercel Deployment Guide

This guide will help you deploy the Sports Day Management App to Vercel.

## Important Notes

⚠️ **Database Limitation**: SQLite with file-based storage has limitations on Vercel's serverless functions. The database will be stored in `/tmp` which is ephemeral (data is lost between deployments/cold starts). For production use, consider migrating to:
- PostgreSQL (Vercel Postgres, Supabase, Railway)
- MongoDB Atlas
- PlanetScale
- Other cloud database services

## Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub/GitLab/Bitbucket

3. **Import Project**
   - Click "New Project"
   - Select your repository
   - Import the project

4. **Configure Project Settings**
   - **Framework Preset**: Create React App
   - **Root Directory**: Leave as root (or select if using monorepo)
   - **Build Command**: `cd client && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install && cd client && npm install`

5. **Environment Variables** (Optional)
   - `REACT_APP_API_URL`: `/api` (for production)
   - This is already set in the code as default

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Link to existing project or create new
   - Confirm settings

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Configuration

After deployment, you'll need to set up the API endpoints. Since the current setup uses Express, you have two options:

### Option A: Deploy Backend Separately
- Deploy the Express server to a service like Railway, Render, or Fly.io
- Update `REACT_APP_API_URL` environment variable to point to your backend URL

### Option B: Convert to Serverless Functions
- Convert Express routes to Vercel serverless functions
- Requires refactoring the backend code

## Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

- `REACT_APP_API_URL`: Your API URL (defaults to `/api` for same domain)

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)
- Check build logs in Vercel dashboard

### API Not Working
- Verify API routes are configured correctly
- Check that serverless functions are deployed
- Review function logs in Vercel dashboard

### Database Issues
- Remember that `/tmp` is ephemeral on Vercel
- Consider using a cloud database for persistent storage

## Current Configuration Files

- `vercel.json`: Vercel configuration
- `client/vercel.json`: Client-specific config (if needed)
- `.vercelignore`: Files to exclude from deployment
- `.gitignore`: Git ignore patterns

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
