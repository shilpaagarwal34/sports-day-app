# Step-by-Step: Find Supabase Connection String

## You're Currently On: API Settings Page ❌
You need to go to **Database Settings** instead.

## Correct Steps:

### Step 1: Go to Database Settings
1. Look at the **left sidebar**
2. Under **"CONFIGURATION"** section
3. Click on **"Database"** (it has an arrow icon →)
4. This will open the Database settings

### Step 2: Find Connection String
Once in Database settings:

1. **Look for tabs at the top** of the page:
   - **"Settings"** (you might be here)
   - **"Connection string"** or **"Connection info"** ← Click this!
   - Or scroll down on the Settings tab

2. **If you see "Connection string" section:**
   - Scroll down past SSL Configuration
   - Look for **"Connection string"** or **"Connection pooling"**
   - You'll see different formats:
     - **URI** ← This is what you need!
     - JDBC
     - Node.js
     - etc.

3. **Copy the URI:**
   - It will look like:
     ```
     postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
   - Or:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
     ```

### Alternative: Direct Link Method

1. **In the left sidebar**, find **"CONFIGURATION"**
2. Click **"Database"** (the one with the arrow →)
3. This should take you to Database settings
4. Look for **"Connection string"** section

### If You Still Can't Find It:

**Try this:**
1. Go to **Project Settings** (gear icon at bottom of left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to find **"Connection string"** or **"Connection info"**

## What You're Looking For:

The connection string section will show:
- **Connection pooling** options
- **URI** format (this is what Railway needs)
- Different connection modes (Session, Transaction, Statement)

## Quick Visual Guide:

```
Left Sidebar:
├── PROJECT SETTINGS
│   └── ...
└── CONFIGURATION
    └── Database → ← CLICK HERE!
        └── Then look for "Connection string" section
```

## The Connection String Format:

Once you find it, it should look like:
```
postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password!
