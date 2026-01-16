# PostgreSQL Setup Complete! 🎉

The code has been updated to support PostgreSQL (Supabase). Here's what to do next:

## Step 1: Add DATABASE_URL to Railway

1. **Go to Railway Dashboard**
   - https://railway.app
   - Click on your service (`sports-day-app`)

2. **Go to Settings → Variables**
   - Click "Settings" tab
   - Click "Variables" (left sidebar)

3. **Add Environment Variable**
   - Click "New Variable" or "Add"
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
     - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
     - Get it from: Supabase Dashboard → Settings → Database → Connection string
   - **Environments**: Select all (Production, Preview, Development)
   - Click "Save"

## Step 2: Redeploy Service

1. **Go to Deployments tab**
2. **Redeploy** the service (or wait for auto-deploy)
3. **Wait** for deployment to complete (2-3 minutes)

## Step 3: Verify It's Working

1. **Check Railway logs**
   - Should see: `Connected to PostgreSQL database`
   - Should see: `Database initialized successfully`

2. **Test your app**
   - Visit your Vercel frontend
   - Add some data (players, game assignments)
   - Refresh the page
   - **Data should persist!** ✅

## How It Works

- **If `DATABASE_URL` is set**: Uses PostgreSQL (Supabase) - **persistent**
- **If `DATABASE_URL` is NOT set**: Uses SQLite - ephemeral (for local dev)

## What Changed

✅ Added `pg` package for PostgreSQL
✅ Created database adapter for both SQLite and PostgreSQL
✅ Updated all queries to work with both databases
✅ Automatic detection based on `DATABASE_URL` environment variable

## Troubleshooting

### Connection Error

**Check:**
- `DATABASE_URL` is set correctly in Railway
- Connection string includes password
- Supabase project is active

### Tables Not Created

**Check Railway logs:**
- Should see "Database initialized successfully"
- If errors, check connection string format

### Data Still Disappearing

**Verify:**
- `DATABASE_URL` is set in Railway
- Service was redeployed after adding variable
- Logs show "Connected to PostgreSQL database"

## Quick Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] `DATABASE_URL` added to Railway
- [ ] Service redeployed
- [ ] Logs show PostgreSQL connection
- [ ] Tested - data persists! ✅

---

**After adding `DATABASE_URL` and redeploying, your data will persist forever!** 🚀
