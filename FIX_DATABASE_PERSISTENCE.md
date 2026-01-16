# Fix: Database Data Disappearing on Refresh

## The Problem

Your SQLite database is stored in the project directory, which is **ephemeral** on Railway. This means:
- Data is lost on every deployment
- Data is lost on every restart
- Data is lost when the service restarts

## Solution: Use Railway Volume for Database Persistence

Railway provides persistent volumes that survive deployments and restarts.

### Step 1: Create a Volume in Railway

1. **Go to Railway Dashboard**
   - https://railway.app
   - Click on your service (`sports-day-app`)

2. **Go to Settings Tab**
   - Click "Settings" (left sidebar)

3. **Scroll to "Volumes" Section**
   - Look for "Volumes" or "Persistent Storage"
   - Click "Create Volume" or "Add Volume"

4. **Configure Volume**
   - **Name**: `database-storage` (or any name)
   - **Mount Path**: `/data` (or `/persist`)
   - **Size**: 1 GB (or as needed)
   - Click "Create"

### Step 2: Update Database Path

The database file needs to be stored in the volume mount path.

**Current code** stores it in project directory (ephemeral)
**New code** should store it in `/data` (persistent volume)

### Step 3: Update Environment Variable (Optional)

You can also set an environment variable for the database path:
- **Key**: `DB_PATH`
- **Value**: `/data/sports_day.db`

## Alternative: Use Railway PostgreSQL (Recommended for Production)

For production, consider migrating to Railway's PostgreSQL service:

1. **Add PostgreSQL Service**
   - Railway Dashboard → New → Database → PostgreSQL
   - Railway will provide connection string automatically

2. **Update Code**
   - Replace SQLite with PostgreSQL
   - Use `pg` or `pg-promise` library

## Quick Fix: Update Database Path

The code needs to be updated to use the volume path. See the code changes below.

---

**Next Steps:**
1. Create Railway volume
2. Update database path in code
3. Redeploy
