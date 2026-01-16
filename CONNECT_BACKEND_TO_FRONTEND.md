# Connect Railway Backend to Vercel Frontend

Now that you have your Railway backend URL, let's connect it to your Vercel frontend!

## Step 1: Add Environment Variable to Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your `sports-day-app` project

2. **Navigate to Environment Variables**
   - Click **"Settings"** tab (top menu)
   - Click **"Environment Variables"** (left sidebar)

3. **Add New Variable**
   - Click **"Add"** or **"Add New"** button
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL
     - **Important**: Include `/api` at the end!
   - **Environments**: Check all three boxes:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
   - Click **"Save"**

## Step 2: Redeploy Frontend

1. **Go to "Deployments" tab**
2. **Find your latest deployment**
3. **Click the three dots (⋯)** menu on the deployment
4. **Click "Redeploy"**
5. **Wait 1-2 minutes** for deployment to complete

## Step 3: Test Your Application

1. **Visit your Vercel URL**
   - Should be something like: `https://sports-day-app-xxxx.vercel.app`

2. **Test each page:**
   - ✅ **Dashboard** - Should show game and player statistics
   - ✅ **Players** - Should show all 13 players
   - ✅ **Games** - Should show all 10 games
   - ✅ **Add players to games** - Should work

3. **Check browser console** (F12)
   - Should see API calls to your Railway backend
   - No CORS errors

## Example Configuration

**Railway URL**: `https://sports-day-app-production-abc123.up.railway.app`

**Vercel Environment Variable**:
- Key: `REACT_APP_API_URL`
- Value: `https://sports-day-app-production-abc123.up.railway.app/api`

**Note**: The `/api` is added because your frontend code expects API endpoints at `/api/*`

## Verify It's Working

### Test Backend Directly:
```
https://your-railway-url.up.railway.app/api/health
```
Should return: `{"status":"ok","message":"Sports Day Management API is running"}`

### Test Frontend:
```
https://your-vercel-url.vercel.app
```
- Dashboard should load with data
- No "Failed to fetch" errors
- Data appears from backend

## Troubleshooting

### Frontend Shows "Failed to fetch"
- **Check**: Environment variable is set correctly
- **Check**: Railway URL includes `/api` at the end
- **Check**: Railway service is running
- **Solution**: Redeploy frontend after fixing

### CORS Errors
- **Check**: Railway backend has CORS enabled (it should)
- **Check**: Environment variable URL is correct
- **Solution**: Verify backend is accessible

### No Data Showing
- **Check**: Browser console for errors
- **Check**: Network tab to see API calls
- **Check**: Railway logs for errors
- **Solution**: Test backend URL directly first

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Added `REACT_APP_API_URL` to Vercel
- [ ] Value includes `/api` at the end
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved environment variable
- [ ] Redeployed frontend on Vercel
- [ ] Tested frontend URL
- [ ] Dashboard shows data
- [ ] Players page shows players
- [ ] Games page shows games

## Your URLs

**Backend (Railway)**: `https://your-railway-url.up.railway.app`
**Frontend (Vercel)**: `https://your-vercel-url.vercel.app`

**API Endpoint**: `https://your-railway-url.up.railway.app/api`

---

**You're almost done! Just add the environment variable and redeploy!** 🚀
