# Debug: API Still Not Working After Adding https://

Let's troubleshoot step by step.

## Step 1: Verify Environment Variable is Correct

**In Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Check `REACT_APP_API_URL` value
3. Should be: `https://web-production-17317.up.railway.app/api`
4. Make sure it's saved

## Step 2: Verify You Redeployed

**Critical:** You MUST redeploy after changing environment variables!

1. Go to Deployments tab
2. Check the latest deployment timestamp
3. Was it deployed AFTER you added `https://`?
4. If not, redeploy now:
   - Click three dots (⋯) → Redeploy
   - Wait for it to complete

## Step 3: Test Railway Backend Directly

Open this URL in your browser:
```
https://web-production-17317.up.railway.app/api/health
```

**Expected response:**
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

**If this doesn't work:**
- Railway backend might be down
- Check Railway dashboard for service status
- Check Railway logs for errors

## Step 4: Check Browser Console

1. Open your Vercel app
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Go to "Network" tab
5. Click on Players or Games tab
6. Look for:
   - **Console errors** (red messages)
   - **Network requests** - what URL are they going to?
   - **CORS errors** - might see "CORS policy" errors

## Step 5: Check What URL is Being Used

In the browser Network tab:
- Look for requests to `/api/players` or `/api/games`
- Check the "Request URL" column
- Is it going to:
  - ✅ `https://web-production-17317.up.railway.app/api/...` (correct)
  - ❌ `http://localhost:5000/api/...` (wrong - env var not set)
  - ❌ `/api/...` (wrong - using relative URL)

## Common Issues

### Issue 1: Not Redeployed
**Symptom:** Variable set but still using old value
**Fix:** Redeploy frontend

### Issue 2: CORS Error
**Symptom:** Console shows "CORS policy" error
**Fix:** Check Railway backend has CORS enabled (should be in server/index.js)

### Issue 3: Railway Backend Down
**Symptom:** Can't access Railway URL directly
**Fix:** Check Railway dashboard, restart service if needed

### Issue 4: Wrong Environment
**Symptom:** Variable set but not applied
**Fix:** Make sure "All Environments" is selected

### Issue 5: Build Cache
**Symptom:** Old build still being used
**Fix:** Clear browser cache, or redeploy with "Clear build cache" option

## Debug Checklist

- [ ] Environment variable has `https://` prefix
- [ ] Environment variable saved in Vercel
- [ ] Frontend redeployed after setting variable
- [ ] Railway backend accessible (test `/api/health`)
- [ ] Railway service is running
- [ ] Browser console checked for errors
- [ ] Network tab shows correct API URL
- [ ] No CORS errors in console

## What to Share

If still not working, please share:
1. **Browser Console errors** (F12 → Console tab)
2. **Network tab** - what URL are requests going to?
3. **Railway health check** - does `https://web-production-17317.up.railway.app/api/health` work?
4. **Vercel deployment status** - is it deployed successfully?
