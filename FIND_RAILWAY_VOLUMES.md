# How to Find Volumes in Railway

## Where to Look

### Method 1: Settings Tab

1. **Railway Dashboard** → Your service
2. **Settings** tab (left sidebar)
3. **Scroll down** - look for:
   - "Volumes"
   - "Persistent Storage"
   - "Storage"
   - "Mounts"
   - "Persistent Volumes"

### Method 2: Service Overview

1. **Click on your service**
2. **Look at the main page** - might show volumes section
3. **Check tabs** at the top or bottom

### Method 3: Project Settings

1. **Go to Project level** (not service level)
2. **Settings** → Look for volumes/storage

### Method 4: Railway CLI

If UI doesn't show it, use CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# List volumes
railway volumes

# Create volume
railway volume create --name database-storage --mount /data --size 1GB
```

## If Volumes Don't Exist

Railway volumes might:
- Only be on **Pro/Hacker plan**
- Not available on **Starter plan**
- Need to be enabled

## Alternative: Use Railway PostgreSQL

Instead of SQLite + volumes, use Railway's PostgreSQL:

1. **Railway Dashboard** → Your project
2. **Click "New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creates database automatically
4. Connection string provided automatically

This is **easier** and **more reliable** than volumes!

## Quick Check

**Tell me:**
1. What plan are you on? (Starter/Pro/Hacker)
2. Do you see "Database" option when clicking "New"?
3. What options do you see in Settings tab?

---

**If volumes aren't available, PostgreSQL is the best alternative!**
