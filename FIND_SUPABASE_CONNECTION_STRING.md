# How to Find Supabase Connection String

## Step-by-Step Guide

### Step 1: Go to Database Settings
1. In Supabase Dashboard, you're already on the **Database** section
2. Click on **Settings** in the left sidebar (you're already there!)

### Step 2: Find Connection String Section
1. On the Settings page, scroll down
2. Look for a section called **"Connection string"** or **"Connection pooling"**
3. It's usually below the SSL Configuration section

### Step 3: Get the Connection String
You'll see different connection string formats:

#### Option A: Connection Pooling (Recommended for Railway)
- Look for **"Connection pooling"** or **"Transaction mode"**
- Find the **"URI"** format
- It should look like:
  ```
  postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- **Copy this URI** - this is what you need for Railway

#### Option B: Direct Connection
- Look for **"Connection string"** or **"URI"**
- It should look like:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
  ```
- This also works, but pooling is better for serverless/cloud deployments

### Step 4: Replace Password
1. The connection string will have `[YOUR-PASSWORD]` placeholder
2. Replace it with your **actual database password**
3. If you don't know your password:
   - Go to **Settings** → **Database** → **Database password**
   - Or reset it if needed

### Step 5: Copy Complete String
Make sure you copy the **entire** connection string:
- Starts with `postgresql://` or `postgres://`
- Includes username, password, host, port, and database name
- No spaces or line breaks

## Alternative: If You Can't Find It

### Method 1: Check Connection Info Tab
1. In Database Settings, look for tabs at the top
2. Click on **"Connection info"** or **"Connection string"** tab
3. The connection string should be displayed there

### Method 2: Use Connection Pooling Section
1. Scroll down in Settings
2. Look for **"Connection pooling"** section
3. You'll see different connection modes:
   - **Session mode**
   - **Transaction mode** (recommended)
   - **Statement mode**
4. Click on **"Transaction mode"** or any mode
5. Copy the **URI** shown

### Method 3: From Project Settings
1. Go to **Project Settings** (gear icon in left sidebar)
2. Click on **"Database"** in the settings menu
3. Scroll to **"Connection string"** section
4. Copy the URI

## What the Connection String Should Look Like

**For Connection Pooling (Recommended):**
```
postgresql://postgres.xxxxxxxxxxxx:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**For Direct Connection:**
```
postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

## Important Notes

1. **Replace [PASSWORD]**: Always replace the placeholder with your actual password
2. **No spaces**: Make sure there are no spaces before or after the connection string
3. **Special characters**: If your password has special characters (`@`, `#`, `%`, etc.), they may need URL encoding:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `%` becomes `%25`
   - etc.

## Quick Checklist

- [ ] Found "Connection string" or "Connection pooling" section
- [ ] Selected "URI" format (not JDBC or other formats)
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] Copied the complete string (no truncation)
- [ ] No extra spaces or newlines
- [ ] String starts with `postgresql://` or `postgres://`

## If Still Can't Find It

The connection string might be in:
- **Settings** → **Database** → Scroll down to find connection info
- **Project Settings** → **Database** → Connection string section
- Look for a tab or section labeled **"Connection info"** or **"Connection pooling"**
