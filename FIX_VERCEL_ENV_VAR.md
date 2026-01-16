# Fix: "Failed to load players" Error

The error occurs because the frontend is trying to connect to `localhost:5000` instead of your Railway backend.

## The Problem

1. **Environment variable not set** in Vercel, OR
2. **Frontend not redeployed** after setting environment variable, OR
3. **Environment variable value incorrect**

## Solution: Set Environment Variable in Vercel

### Step 1: Go to Vercel Dashboard

1. **Open**: https://vercel.com/dashboard
2. **Click**: Your `sports-day-app` project

### Step 2: Add Environment Variable

1. **Click**: "Settings" tab (top menu)
2. **Click**: "Environment Variables" (left sidebar)
3. **Click**: "Add New" or "Add" button

### Step 3: Enter the Values

**Key:**
```
REACT_APP_API_URL
```

**Value:**
```
https://your-railway-url.up.railway.app/api
```
- Replace `your-railway-url` with your actual Railway URL
- **IMPORTANT**: Include `/api` at the end!

**Environments:**
- ☑ Production
- ☑ Preview
- ☑ Development

4. **Click**: "Save"

### Step 4: Redeploy Frontend

**CRITICAL**: You MUST redeploy after adding the environment variable!

1. **Go to**: "Deployments" tab
2. **Find**: Your latest deployment
3. **Click**: Three dots (⋯) menu
4. **Click**: "Redeploy"
5. **Wait**: 1-2 minutes for deployment

### Step 5: Verify

1. **Visit**: Your Vercel URL
2. **Click**: Players tab
3. **Should see**: All players loaded ✅

## Example Configuration

**If your Railway URL is:**
```
https://sports-day-app-production-abc123.up.railway.app
```

**Then in Vercel, set:**
- Key: `REACT_APP_API_URL`
- Value: `https://sports-day-app-production-abc123.up.railway.app/api`

## Common Mistakes

### ❌ Wrong: Missing /api
```
Value: https://sports-day-app-production-abc123.up.railway.app
```

### ✅ Correct: Includes /api
```
Value: https://sports-day-app-production-abc123.up.railway.app/api
```

### ❌ Wrong: Not redeploying
- Setting the variable is not enough
- You MUST redeploy for changes to take effect

### ✅ Correct: Set variable + Redeploy
1. Set environment variable
2. Save
3. Go to Deployments
4. Redeploy

## Verify Environment Variable is Set

1. **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. **You should see**: `REACT_APP_API_URL` listed
3. **Value should be**: Your Railway URL + `/api`

## Test Backend Directly

Before fixing frontend, test your Railway backend:

```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

## Test Frontend After Fix

1. **Open**: Your Vercel URL
2. **Open**: Browser Developer Tools (F12)
3. **Go to**: Network tab
4. **Click**: Players tab
5. **Check**: API request should go to your Railway URL, not localhost

## Still Not Working?

### Check 1: Environment Variable
- Is it set in Vercel?
- Does it include `/api`?
- Is it saved?

### Check 2: Redeployment
- Did you redeploy after setting the variable?
- Check deployment logs for errors

### Check 3: Railway Backend
- Is Railway service running?
- Test Railway URL directly in browser
- Check Railway logs for errors

### Check 4: Browser Console
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab to see where requests are going

## Quick Checklist

- [ ] Got Railway backend URL
- [ ] Added `REACT_APP_API_URL` to Vercel
- [ ] Value includes `/api` at the end
- [ ] Selected all environments
- [ ] Saved the variable
- [ ] Redeployed frontend on Vercel
- [ ] Waited for deployment to complete
- [ ] Tested Players page
- [ ] Players load successfully ✅

---

**The fix is simple: Set the environment variable and redeploy!** 🚀
