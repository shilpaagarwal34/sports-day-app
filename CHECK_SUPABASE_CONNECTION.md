# How to Check if Supabase is Connected to Railway

## Method 1: Check Railway Environment Variables

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Login with GitHub
   - Select your project: `sports-day-app`
   - Click on your service

2. **Check Environment Variables**
   - Go to **Settings** tab
   - Scroll down to **Variables** section
   - Look for `DATABASE_URL` variable
   
   **✅ If `DATABASE_URL` exists:**
   - Supabase connection string is configured
   - Should start with: `postgresql://` or `postgres://`
   - Value should include: `supabase` (if using Supabase)
   
   **❌ If `DATABASE_URL` doesn't exist:**
   - Supabase is NOT connected
   - Railway is using SQLite (which won't persist)

## Method 2: Check Railway Logs

1. **View Logs**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **"View Logs"** or check the **Logs** tab

2. **Look for Database Connection Messages**

   **✅ Connected to PostgreSQL (Supabase):**
   ```
   [DATABASE] Starting database initialization...
   [DATABASE] usePostgreSQL: true
   [DATABASE] DATABASE_URL: postgresql://...
   [DATABASE] Attempting PostgreSQL connection...
   [DATABASE] PostgreSQL connection successful!
   [DATABASE] ✅ Database initialized successfully
   ```

   **❌ Using SQLite (Not Connected to Supabase):**
   ```
   [DATABASE] Starting database initialization...
   [DATABASE] usePostgreSQL: false
   [DATABASE] DATABASE_URL: not set
   [DATABASE] Using SQLite (no DATABASE_URL set)
   Using SQLite database at: /app/server/sports_day.db
   ```

   **❌ Connection Failed:**
   ```
   [DATABASE] ❌ PostgreSQL initialization failed
   [DATABASE] Error: connection refused
   [DATABASE] Error code: ECONNREFUSED
   ```

## Method 3: Test API Endpoint

Try accessing your Railway API:
```
https://web-production-17317.up.railway.app/api/dashboard
```

**✅ If it works:**
- Should return JSON data (games and players)
- Database is connected and working

**❌ If you get "Database not initialized":**
- Check Railway logs for errors
- Verify `DATABASE_URL` is set correctly

## Method 4: Verify DATABASE_URL Format

Your `DATABASE_URL` should look like:
```
postgresql://postgres.xxxxxxxxxxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

Or:
```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

**Important:**
- Replace `[PASSWORD]` with your actual database password
- Should include your Supabase project credentials

## How to Add DATABASE_URL to Railway

If `DATABASE_URL` is missing:

1. **Get Supabase Connection String**
   - Go to Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to **Settings** → **Database**
   - Under **Connection string**, find **URI**
   - Copy the connection string
   - **Important:** Replace `[YOUR-PASSWORD]` with your actual database password

2. **Add to Railway**
   - Go to Railway Dashboard → Your Service
   - Click **Settings** → **Variables**
   - Click **"+ New Variable"**
   - **Name:** `DATABASE_URL`
   - **Value:** Paste your Supabase connection string
   - Click **"Add"**
   - Railway will automatically redeploy

3. **Verify Connection**
   - Wait for redeployment (1-2 minutes)
   - Check logs for: `[DATABASE] ✅ Database initialized successfully`
   - Test API: `https://web-production-17317.up.railway.app/api/health`

## Quick Checklist

- [ ] `DATABASE_URL` exists in Railway Variables
- [ ] `DATABASE_URL` starts with `postgresql://`
- [ ] Railway logs show "PostgreSQL connection successful!"
- [ ] API endpoint `/api/dashboard` returns data (not "Database not initialized")
- [ ] No errors in Railway logs about database connection

## Common Issues

### Issue 1: "DATABASE_URL not set"
**Solution:** Add `DATABASE_URL` variable in Railway Settings → Variables

### Issue 2: "Connection refused" or "Connection timeout"
**Solution:** 
- Check Supabase connection string is correct
- Verify database password is correct
- Check Supabase dashboard → Settings → Database → Connection pooling is enabled
- Make sure Supabase project is active

### Issue 3: "Database not initialized"
**Solution:**
- Check Railway logs for specific error
- Verify `DATABASE_URL` format is correct
- Ensure database password doesn't have special characters that need URL encoding

### Issue 4: Using SQLite instead of PostgreSQL
**Solution:**
- Add `DATABASE_URL` environment variable to Railway
- Value must be a valid PostgreSQL connection string
- Redeploy after adding variable
