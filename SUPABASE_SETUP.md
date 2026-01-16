# Use Supabase (Free PostgreSQL) for Data Persistence

Since Railway volumes aren't available on your plan, we'll use **Supabase** - a free PostgreSQL database service.

## Why Supabase?

- ✅ **100% Free** (generous free tier)
- ✅ **PostgreSQL** (production-ready)
- ✅ **Easy setup** (5 minutes)
- ✅ **Automatic persistence**
- ✅ **No credit card required**

## Step 1: Create Supabase Account

1. **Go to**: https://supabase.com
2. **Click**: "Start your project" or "Sign up"
3. **Sign up** with GitHub (easiest)
4. **Create a new project**

## Step 2: Create Project

1. **Click**: "New Project"
2. **Fill in**:
   - **Name**: `sports-day-app` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
3. **Click**: "Create new project"
4. **Wait**: 2-3 minutes for setup

## Step 3: Get Connection String

1. **Go to**: Project Settings (gear icon)
2. **Click**: "Database" (left sidebar)
3. **Scroll to**: "Connection string"
4. **Copy**: "Connection string" (URI format)
   - Looks like: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
5. **Save this** - you'll need it!

## Step 4: Add to Railway

1. **Railway Dashboard** → Your service
2. **Settings** → **Variables**
3. **Add New Variable**:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environments**: All
4. **Save**

## Step 5: Update Code

I'll help you migrate from SQLite to PostgreSQL using Supabase.

---

**Next: I'll update the code to use PostgreSQL instead of SQLite!**
