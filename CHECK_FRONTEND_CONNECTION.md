# Backend Works! Now Check Frontend Connection

✅ **Good news:** Your Railway backend is working!
- URL: `https://web-production-17317.up.railway.app/api/health`
- Response: `{"status":"ok",...}`

Now let's check why the frontend isn't connecting.

## Step 1: Check What URL Frontend is Using

1. **Open your Vercel app** (your frontend URL)
2. **Press F12** (Developer Tools)
3. **Go to "Network" tab**
4. **Click on "Players" or "Games" tab** in your app
5. **Look at the Network requests:**
   - What URL are they going to?
   - Should be: `https://web-production-17317.up.railway.app/api/players`
   - If you see `localhost:5000` → Environment variable not set
   - If you see `/api/players` → Using relative URL (wrong)

## Step 2: Check Console for Errors

In the same Developer Tools:
1. **Go to "Console" tab**
2. **Look for red error messages**
3. **Common errors:**
   - `Failed to fetch` → Connection issue
   - `CORS policy` → CORS issue
   - `Network error` → URL issue

## Step 3: Verify Environment Variable in Build

The environment variable must be set **before** the build happens.

**Check in Vercel:**
1. Go to Deployments tab
2. Click on the latest deployment
3. Check the build logs
4. Look for environment variables being injected

**Or check if variable is in the build:**
- Environment variables are injected at build time
- If you set it after deployment, you MUST redeploy

## Step 4: Force Redeploy with Clear Cache

1. **Vercel Dashboard** → Your project
2. **Deployments** tab
3. **Click three dots (⋯)** on latest deployment
4. **Click "Redeploy"**
5. **IMPORTANT:** If available, check "Clear build cache" option
6. **Wait for deployment to complete**

## Step 5: Hard Refresh Browser

After redeployment:
1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Or: Ctrl+F5 (hard refresh)
2. **Or use Incognito/Private window** to test

## Common Issues

### Issue 1: Not Redeployed
**Symptom:** Variable set but frontend still uses old value
**Fix:** Redeploy frontend

### Issue 2: Environment Variable Not in Build
**Symptom:** Variable exists but not used
**Fix:** 
- Make sure variable is set BEFORE deployment
- Or redeploy after setting variable

### Issue 3: CORS Error
**Symptom:** Console shows "CORS policy" error
**Fix:** Check Railway backend has CORS enabled (should be in server/index.js)

### Issue 4: Wrong URL Format
**Symptom:** Requests going to wrong URL
**Fix:** Verify environment variable value is exactly:
```
https://web-production-17317.up.railway.app/api
```

## What to Check Now

1. **Browser Network tab:**
   - What URL are API requests going to?
   - Share this information

2. **Browser Console:**
   - Any error messages?
   - Share the errors

3. **Vercel Deployment:**
   - When was the last deployment?
   - Was it after you set the environment variable?

## Quick Test

After redeploying, test this:
1. Open your Vercel app
2. F12 → Network tab
3. Click Players tab
4. Look for request to `/api/players`
5. Check the "Request URL" - should show your Railway URL

---

**Next step: Check browser Network tab and share what URL it's using!**
