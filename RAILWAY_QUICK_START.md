# Railway Quick Start Guide

## 🚀 5-Minute Setup

### 1. Push to GitHub (if not done)
```bash
git init
git add .
git commit -m "Ready for Railway deployment"
git remote add origin https://github.com/YOUR_USERNAME/sports-day-app.git
git push -u origin main
```

### 2. Deploy on Railway

1. Go to **railway.app** → Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **sports-day-app** repository
4. Railway auto-detects and starts deploying ✅

### 3. Configure Service

In Railway dashboard:
- Click on your service
- Go to **Settings** tab
- Set **Start Command**: `node server/index.js`
- Click **"Save"**

### 4. Get Your URL

- Railway automatically generates a URL
- Go to **Settings** → **Networking**
- Copy the public URL (e.g., `https://sports-day-app-production.up.railway.app`)

### 5. Test Backend

Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

Should see:
```json
{"status":"ok","message":"Sports Day Management API is running"}
```

### 6. Connect Frontend

In **Vercel Dashboard**:
1. Go to your project → **Settings** → **Environment Variables**
2. Click **"Add"**
3. **Key**: `REACT_APP_API_URL`
4. **Value**: `https://your-railway-url.up.railway.app/api`
5. **Environments**: Select all (Production, Preview, Development)
6. Click **"Save"**
7. **Redeploy**: Go to Deployments → Latest → Click "Redeploy"

### 7. Verify Everything Works

Visit your Vercel URL:
- Dashboard should load data ✅
- Players page should show players ✅
- Games page should show games ✅

---

## 📋 Important Settings in Railway

| Setting | Value |
|---------|-------|
| **Start Command** | `node server/index.js` |
| **Root Directory** | `/` (root) |
| **Build Command** | `npm install` (auto) |

---

## 🔗 Your URLs

After deployment:
- **Backend**: `https://your-app-production.up.railway.app`
- **Frontend**: `https://your-vercel-app.vercel.app`

---

## ⚠️ Common Issues

**Issue**: Service won't start
- **Fix**: Check Start Command is `node server/index.js`

**Issue**: Build fails
- **Fix**: Ensure all dependencies are in `package.json`

**Issue**: API returns 404
- **Fix**: Make sure URL includes `/api` prefix

**Issue**: Frontend can't connect
- **Fix**: Check `REACT_APP_API_URL` is set in Vercel and redeploy

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check deployment logs in Railway dashboard
