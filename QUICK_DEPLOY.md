# Quick Vercel Deployment

## Prerequisites
- GitHub/GitLab/Bitbucket account
- Code pushed to a repository

## Deploy in 3 Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Create React App
5. Click "Deploy"

### Step 3: Configure (if needed)
- **Root Directory**: Leave as default
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/build`

## Environment Variables (Optional)
In Vercel Dashboard → Settings → Environment Variables:
- `REACT_APP_API_URL`: Set to your backend API URL
- Default: Uses `/api` (same domain)

## Note About Backend
The Express backend needs to be deployed separately or converted to serverless functions. For now, the frontend will be deployed, and you'll need to:

**Option 1**: Deploy backend to Railway/Render/Fly.io
- Update `REACT_APP_API_URL` to your backend URL

**Option 2**: Convert Express routes to Vercel serverless functions
- Requires refactoring (can be done later)

## Deploy via CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production deploy
vercel --prod
```
