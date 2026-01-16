# Deploy to Vercel - Step by Step

Your project isn't in Vercel yet. Let's deploy it now!

## Step 1: Go to Vercel

1. **Open**: https://vercel.com
2. **Click**: "Sign Up" or "Log In"
3. **Sign in with GitHub** (use the same GitHub account as your repository)

## Step 2: Import Your Project

1. **Click**: "Add New..." button (top right)
2. **Select**: "Project"
3. **Click**: "Import Git Repository"
4. **Find**: `sports-day-app` repository
   - If you don't see it, click "Adjust GitHub App Permissions"
   - Make sure Vercel has access to your repositories
5. **Click**: "Import" next to `sports-day-app`

## Step 3: Configure Project Settings

Vercel will show a configuration screen. Set these:

### Framework Preset
- **Select**: "Create React App" (or leave as "Other")

### Root Directory
- **Leave as**: `./` (root directory)

### Build and Output Settings
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm install && cd client && npm install`

### Environment Variables (Optional - Add Later)
- You can skip this for now
- We'll add `REACT_APP_API_URL` after deployment

## Step 4: Deploy

1. **Click**: "Deploy" button
2. **Wait**: 2-3 minutes for build to complete
3. **Watch**: The build logs in real-time

## Step 5: Get Your Frontend URL

After deployment completes:
1. You'll see: "Congratulations! Your project has been deployed"
2. **Copy the URL** - It will look like:
   ```
   https://sports-day-app-xxxx.vercel.app
   ```
3. **Click on the URL** to open your app

## Step 6: Add Environment Variable (After Railway)

Once you have your Railway backend URL:

1. **Go to**: Vercel Dashboard
2. **Click**: Your `sports-day-app` project
3. **Go to**: Settings → Environment Variables
4. **Click**: "Add New"
5. **Enter**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
   - **Environments**: Select all (Production, Preview, Development)
6. **Click**: "Save"
7. **Redeploy**: Go to Deployments → Latest → Redeploy

## Troubleshooting

### Can't Find Repository
- **Solution**: 
  - Click "Adjust GitHub App Permissions"
  - Grant Vercel access to your repositories
  - Refresh the page

### Build Fails
- **Check**: Build logs in Vercel dashboard
- **Verify**: Build command is correct
- **Common issue**: Missing dependencies - check `package.json`

### Wrong Account
- **Solution**: 
  - Log out of Vercel
  - Log in with the correct GitHub account
  - Try importing again

### Project Name Different
- **Solution**: 
  - Check all projects in Vercel dashboard
  - Look for any project with similar name
  - Or search for your GitHub username

## Quick Checklist

- [ ] Logged into Vercel with correct GitHub account
- [ ] Clicked "Add New" → "Project"
- [ ] Imported `sports-day-app` repository
- [ ] Configured build settings
- [ ] Deployed successfully
- [ ] Got frontend URL
- [ ] (Later) Added `REACT_APP_API_URL` environment variable
- [ ] (Later) Redeployed after adding environment variable

## Your Repository

**GitHub**: https://github.com/shilpaagarwal34/sports-day-app

Vercel will:
- Clone your repository
- Install dependencies
- Build the React app
- Deploy it
- Give you a public URL

---

**Ready?** Go to https://vercel.com and import your project! 🚀
