# How to Find Your Railway Backend URL - Complete Guide

## Method 1: Service Overview Page (Most Common)

1. **Go to Railway Dashboard**: https://railway.app
2. **Click on your service** (`sports-day-app`)
3. **Look at the top of the page** - you should see:
   - A section showing your service name
   - A **"Public URL"** or **"Domain"** section
   - A clickable link like: `https://sports-day-app-production-xxxx.up.railway.app`

**This is usually the FIRST thing you see when you click your service!**

## Method 2: Settings → Domains

1. **Click on your service** (`sports-day-app`)
2. **Click "Settings"** tab (left sidebar)
3. **Look for "Domains"** section (scroll down if needed)
4. You'll see:
   - Your Railway domain URL
   - OR a **"Generate Domain"** button (click this if no URL exists)

## Method 3: Service Card on Dashboard

1. **On the main Railway dashboard**
2. **Look at your service card** (the box showing `sports-day-app`)
3. **The URL might be displayed** directly on the card
4. **Or click the service** to see more details

## Method 4: Generate Domain (If Not Visible)

If you don't see a URL anywhere:

1. **Click your service** → **Settings** → **Domains**
2. **Click "Generate Domain"** button
3. Railway will create a public URL for you
4. **Copy the URL** that appears

## Method 5: Check Deployment Logs

1. **Click your service**
2. **Go to "Deployments"** tab
3. **Click on the latest deployment**
4. **Check the logs** - sometimes the URL is printed there

## Visual Guide - Where to Look

### Screen Layout:
```
┌─────────────────────────────────────────┐
│  Railway Dashboard                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ sports-day-app                    │ │ ← Click here
│  │ ● Running                         │ │
│  │ https://...railway.app            │ │ ← URL might be here
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### After Clicking Service:
```
┌─────────────────────────────────────────┐
│  sports-day-app                         │
├─────────────────────────────────────────┤
│                                         │
│  Public URL:                            │ ← LOOK HERE FIRST!
│  https://sports-day-app-production-    │
│  xxxx.up.railway.app                    │
│  [Copy]                                 │
│                                         │
│  [Overview] [Settings] [Deployments]     │
└─────────────────────────────────────────┘
```

### Settings Tab:
```
Settings
├── General
├── Variables
├── Domains  ← CHECK HERE!
│   └── https://sports-day-app-xxxx.up.railway.app
│       OR
│       [Generate Domain] button
└── Start Command
```

## Step-by-Step: Finding URL Right Now

### Quick Steps:
1. ✅ **Go to**: https://railway.app
2. ✅ **Click**: Your service name (`sports-day-app`)
3. ✅ **Look at the TOP** of the page for "Public URL" or domain
4. ✅ **If not there**: Go to **Settings** → **Domains**
5. ✅ **If still not there**: Click **"Generate Domain"**

## What the URL Looks Like

Railway URLs follow this pattern:
```
https://[service-name]-[random-id].up.railway.app
```

Example:
```
https://sports-day-app-production-abc123.up.railway.app
```

## For Your API

Once you have the Railway URL, your API endpoints will be:
- **Health**: `https://your-url.up.railway.app/api/health`
- **Players**: `https://your-url.up.railway.app/api/players`
- **Games**: `https://your-url.up.railway.app/api/games`
- **Dashboard**: `https://your-url.up.railway.app/api/dashboard`

## Quick Checklist

- [ ] Logged into Railway
- [ ] Clicked on `sports-day-app` service
- [ ] Checked top of page for Public URL
- [ ] Checked Settings → Domains
- [ ] Clicked "Generate Domain" if needed
- [ ] Copied the URL
- [ ] Tested: `https://your-url/api/health`

## Still Can't Find It?

### Option 1: Check All Tabs
- **Overview** tab - URL at top
- **Settings** tab → **Domains** section
- **Deployments** tab → Check logs

### Option 2: Generate New Domain
1. Settings → Domains
2. Click "Generate Domain"
3. Wait a few seconds
4. URL will appear

### Option 3: Check Service Status
- Make sure your service is **deployed** and **running**
- If it's still building, wait for it to finish
- URL appears after successful deployment

## Test Your URL

Once you have the URL, test it:
```
https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

---

**Most Common Location**: Top of the service page, or Settings → Domains section!
