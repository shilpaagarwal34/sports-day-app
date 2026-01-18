# Where to Find Application Logs

## Railway Backend Logs (Server-side)

### Method 1: Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Sign in with your GitHub account

2. **Navigate to Your Project**
   - Click on your project (e.g., "sports-day-app" or your project name)

3. **Open Your Backend Service**
   - Click on your backend service (usually named "web" or "api" or similar)

4. **View Logs**
   - Click on the **"Logs"** tab at the top
   - This shows **real-time logs** of your running server
   - Logs update automatically as requests come in

5. **View Deployment Logs**
   - Click on the **"Deployments"** tab
   - Click on the **latest deployment** (top of the list)
   - This shows logs from the deployment process (build, deploy, etc.)

### What to Look For:

**When dashboard is loading, you should see:**
- `[DASHBOARD] GET /api/dashboard - Request received`
- `[DASHBOARD] Starting database queries...`
- `[DASHBOARD] Found X games`
- `[DASHBOARD] Found X players`
- `[DASHBOARD] Sending response...`

**If there are errors, you'll see:**
- `[DASHBOARD] Error fetching game stats: ...`
- `Database not initialized`
- Connection errors

---

## Vercel Frontend Logs (Client-side)

### Browser Console (Most Important for Frontend)

1. **Open Browser Developer Tools**
   - Press **F12** or **Right-click → Inspect**
   - Go to the **"Console"** tab

2. **What to Look For:**
   - `[Dashboard] Starting to load dashboard data...`
   - `[API] GET https://your-railway-url/api/dashboard`
   - `[API] Dashboard response status: 200`
   - Any error messages in red

### Network Tab (For API Requests)

1. **Open Browser Developer Tools**
   - Press **F12** or **Right-click → Inspect**
   - Go to the **"Network"** tab

2. **Reload the Page**
   - Refresh the dashboard page

3. **Check API Requests:**
   - Look for `/api/dashboard` request
   - Check the **Status** column (should be 200 for success)
   - Click on the request to see:
     - Request Headers
     - Response Headers
     - Response Body
     - Timing information

### Vercel Dashboard Logs

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in with your GitHub account

2. **Navigate to Your Project**
   - Click on your project (e.g., "sports-day-app")

3. **View Function Logs**
   - Go to **"Deployments"** tab
   - Click on the **latest deployment**
   - Click on **"Functions"** or **"Logs"** tab
   - Note: These logs are mainly for serverless functions, not client-side logs

---

## Quick Debugging Steps

### Step 1: Check Railway Backend Logs
1. Go to https://railway.app
2. Click your project → Click your service → Click "Logs" tab
3. Look for `[DASHBOARD]` messages when you load the dashboard

### Step 2: Check Browser Console
1. Open your app in browser
2. Press **F12** → Go to **Console** tab
3. Refresh the dashboard page
4. Look for `[Dashboard]` and `[API]` messages

### Step 3: Check Network Tab
1. Press **F12** → Go to **Network** tab
2. Filter by "dashboard" or "api"
3. Click on the `/api/dashboard` request
4. Check Status, Response, and Timing

---

## Common Log Patterns

### ✅ Success Pattern:
```
[DASHBOARD] GET /api/dashboard - Request received
[DASHBOARD] Starting database queries...
[DASHBOARD] Found 8 games
[DASHBOARD] Found 13 players
[DASHBOARD] Sending response with 8 games and 13 players
```

### ❌ Error Pattern:
```
[DASHBOARD] GET /api/dashboard - Request received
[DASHBOARD] Error fetching game stats: [error message]
```

### ⚠️ Timeout Pattern (499 status):
- Request appears in Network tab with status 499
- No response in Railway logs
- Could indicate database connection timeout or server overload

---

## Screenshot What You See

If you're still having issues:
1. **Screenshot Railway logs** (the [DASHBOARD] messages)
2. **Screenshot Browser Console** (the [Dashboard] and [API] messages)
3. **Screenshot Network tab** (the /api/dashboard request details)

This will help identify the exact issue!