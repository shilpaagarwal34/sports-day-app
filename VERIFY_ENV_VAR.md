# Verify Environment Variable is Set Correctly

## The Problem

The error "Failed to load games. Make sure the server is running on port 5000" means:
- The environment variable `REACT_APP_API_URL` is **NOT set** in Vercel, OR
- The frontend was **NOT redeployed** after setting it

## How to Fix

### Step 1: Check if Environment Variable Exists

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your `sports-day-app` project

2. **Go to Settings → Environment Variables**
   - Left sidebar: "Environment Variables"

3. **Check if `REACT_APP_API_URL` exists**
   - If you see it listed → Go to Step 2
   - If you DON'T see it → Go to Step 3

### Step 2: Verify the Value (If It Exists)

**Check the value:**
- Should be: `https://your-railway-url.up.railway.app/api`
- Must include `/api` at the end
- Must be your actual Railway URL

**If value is wrong:**
1. Click the three dots (⋯) next to the variable
2. Click "Edit"
3. Update the value
4. Save
5. **Redeploy** (Step 4)

### Step 3: Add Environment Variable (If It Doesn't Exist)

1. **Click "Add New"** or "Add" button
2. **Enter:**
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-railway-url.up.railway.app/api`
     - Replace with your actual Railway URL
     - **CRITICAL**: Include `/api` at the end!
   - **Environments**: Select all three:
     - ☑ Production
     - ☑ Preview
     - ☑ Development
3. **Click "Save"**

### Step 4: Redeploy Frontend (REQUIRED!)

**You MUST redeploy after setting/changing the variable!**

1. **Go to "Deployments" tab**
2. **Find your latest deployment**
3. **Click the three dots (⋯)** menu
4. **Click "Redeploy"**
5. **Wait 1-2 minutes** for deployment

### Step 5: Verify It's Working

1. **Visit your Vercel URL**
2. **Open Browser Developer Tools** (F12)
3. **Go to "Console" tab**
4. **Go to "Network" tab**
5. **Click "Players" or "Games" tab**
6. **Check Network tab:**
   - Should see requests to your Railway URL
   - Should NOT see requests to `localhost:5000`

## Common Issues

### Issue 1: Variable Not Set
**Symptom**: Error mentions "port 5000"
**Solution**: Add `REACT_APP_API_URL` environment variable

### Issue 2: Variable Set But Not Redeployed
**Symptom**: Variable exists but still getting errors
**Solution**: Redeploy the frontend

### Issue 3: Wrong Value Format
**Symptom**: Variable set but wrong URL
**Solution**: 
- Check value includes `/api` at the end
- Check Railway URL is correct
- Update and redeploy

### Issue 4: Variable Only Set for One Environment
**Symptom**: Works in one environment but not others
**Solution**: Select all environments (Production, Preview, Development)

## Quick Test

### Test 1: Check Environment Variable
```
Vercel Dashboard → Project → Settings → Environment Variables
```
Should see: `REACT_APP_API_URL` with your Railway URL + `/api`

### Test 2: Check Deployment
```
Vercel Dashboard → Project → Deployments
```
Latest deployment should be recent (after setting variable)

### Test 3: Check Browser Network
1. Open your Vercel app
2. F12 → Network tab
3. Click Players/Games tab
4. Should see requests to Railway URL, not localhost

## Example Configuration

**Railway URL:**
```
https://sports-day-app-production-abc123.up.railway.app
```

**Vercel Environment Variable:**
- Key: `REACT_APP_API_URL`
- Value: `https://sports-day-app-production-abc123.up.railway.app/api`

## Still Not Working?

### Debug Steps:

1. **Verify Railway Backend Works**
   ```
   https://your-railway-url.up.railway.app/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Check Vercel Build Logs**
   - Deployments → Latest → View build logs
   - Look for errors or warnings

3. **Check Browser Console**
   - F12 → Console tab
   - Look for CORS errors or network errors

4. **Verify Variable is in Build**
   - Environment variables are injected at build time
   - Must rebuild/redeploy for changes to take effect

## Checklist

- [ ] Environment variable `REACT_APP_API_URL` exists in Vercel
- [ ] Value is correct (Railway URL + `/api`)
- [ ] All environments selected (Production, Preview, Development)
- [ ] Variable is saved
- [ ] Frontend is redeployed after setting variable
- [ ] Deployment completed successfully
- [ ] Tested in browser - no localhost errors

---

**The fix: Set the variable AND redeploy!** 🚀
