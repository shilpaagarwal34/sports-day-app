# Railway Volume Setup for Database Persistence

## Why Data Disappears

Railway's filesystem is **ephemeral** - it gets wiped on every:
- Deployment
- Service restart
- Container restart

Your SQLite database stored in the project directory gets deleted.

## Solution: Use Railway Persistent Volume

### Step 1: Create Volume in Railway

1. **Go to Railway Dashboard**
   - https://railway.app
   - Click on your service (`sports-day-app`)

2. **Go to Settings**
   - Click "Settings" tab (left sidebar)

3. **Find "Volumes" Section**
   - Scroll down to find "Volumes" or "Persistent Storage"
   - Click "Create Volume" or "Add Volume"

4. **Configure Volume**
   - **Name**: `database-storage`
   - **Mount Path**: `/data`
   - **Size**: 1 GB (minimum, adjust as needed)
   - Click "Create" or "Add"

### Step 2: Verify Volume is Mounted

After creating the volume:
- Railway will automatically mount it at `/data`
- The database file will be stored there
- Data will persist across deployments

### Step 3: Redeploy Service

1. **Go to Deployments tab**
2. **Redeploy** the service (or wait for auto-deploy)
3. **Check logs** to see: `Database path: /data/sports_day.db`

### Step 4: Test Persistence

1. **Add some data** (players, game assignments)
2. **Redeploy** the service
3. **Check** - data should still be there! ✅

## Alternative Mount Paths

If `/data` doesn't work, the code will try:
1. `/data` (primary)
2. `/persist` (fallback)
3. Project directory (last resort - ephemeral)

## Verify It's Working

### Check Logs

After deployment, check Railway logs for:
```
Database path: /data/sports_day.db
```

If you see this, the volume is working!

### Check Volume Usage

In Railway Dashboard:
- Settings → Volumes
- You should see your volume listed
- Check "Usage" to see if database file is there

## Troubleshooting

### Volume Not Found

**Symptom**: Logs show "Warning: /data volume not found"

**Solution**:
1. Check volume is created in Railway
2. Verify mount path is `/data`
3. Redeploy service

### Data Still Disappearing

**Possible causes**:
1. Volume not mounted correctly
2. Database path not using volume
3. Service restarting before data is written

**Solution**:
1. Check Railway logs for database path
2. Verify volume exists and is mounted
3. Check volume usage/storage

## Quick Checklist

- [ ] Volume created in Railway
- [ ] Mount path set to `/data`
- [ ] Service redeployed
- [ ] Logs show `/data/sports_day.db`
- [ ] Data persists after redeploy

---

**After setting up the volume, your data will persist!** 🎉
