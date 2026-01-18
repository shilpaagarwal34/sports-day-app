# Fix Railway Build Issue - Step by Step Guide

## Current Issue
Railway is running `npm ci` instead of `npm install`, causing build failures.

## Option 1: Fix via Railway Dashboard (What to Check)

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Login with GitHub
   - Select your project: `sports-day-app`

2. **Check Service Settings**
   - Click on your service
   - Go to **Settings** tab
   - Scroll down to **Build** section
   - Check if there's a custom build command set
   - If you see `npm ci`, change it to `npm install`
   - Or remove any custom build command to let `nixpacks.toml` handle it

3. **Check Root Directory**
   - In Settings → General
   - **Root Directory** should be: `/` (root)
   - Make sure it's not set to `/client` or something else

4. **Clear Build Cache**
   - Go to Settings → Advanced
   - Click **"Clear Build Cache"**
   - Then redeploy

5. **Force Redeploy**
   - Go to **Deployments** tab
   - Click on latest deployment
   - Click **"Redeploy"** (three dots menu)
   - This will rebuild from scratch

## Option 2: Fix via Code (Remove package-lock.json temporarily)

If Railway keeps using `npm ci`, we can temporarily remove `package-lock.json`:

```bash
# This will force npm install instead of npm ci
git rm package-lock.json
git commit -m "Remove package-lock.json to force npm install"
git push origin main
```

**Note:** After build succeeds, we can regenerate it later.

## Option 3: Fix nixpacks.toml (Already done)

The `nixpacks.toml` file should override the default behavior, but Railway might need:
1. A clean rebuild
2. Settings to be cleared

## What to Check in Railway Logs

When checking Railway logs, look for:
- `[phases.install]` - Should show `npm install` not `npm ci`
- `npm ERR!` messages - These show what's failing
- `exit code: 1` - Indicates build failure

## Quick Fix Checklist

- [ ] Check Railway Settings → Build Command (should be empty or `npm install`)
- [ ] Check Root Directory is `/`
- [ ] Clear Build Cache in Settings → Advanced
- [ ] Force Redeploy from Deployments tab
- [ ] Check logs for actual error (not just `npm ci`)

## If Still Failing

Share the exact error from Railway logs, and I'll help fix it in code.
