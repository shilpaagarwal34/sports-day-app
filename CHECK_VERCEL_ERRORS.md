# How to Check Vercel Deployment Errors

## Step 1: View Build Logs

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click on your `sports-day-app` project

2. **Go to Deployments Tab**
   - Click "Deployments" (top menu)
   - Find the failed deployments (usually marked with ❌)

3. **Click on Failed Deployment**
   - Click on the failed deployment
   - Scroll to "Build Logs" section

4. **Check Error Messages**
   - Look for red error messages
   - Common errors:
     - `Module not found`
     - `Type error`
     - `Build failed`
     - `Command failed`

## Step 2: Common Errors and Fixes

### Error: "Module not found: Can't resolve..."
**Fix**: Missing dependency
- Check if package is in `package.json`
- Run `npm install` locally to verify

### Error: "Type error: Property 'X' does not exist..."
**Fix**: TypeScript error
- Check the file mentioned
- Verify types are correct
- Check for unused imports

### Error: "Build command failed"
**Fix**: Build script issue
- Check `vercel.json` build command
- Verify `package.json` scripts

### Error: "Cannot find module 'react-router-dom'"
**Fix**: Missing dependency
- Already in package.json, but might need reinstall

## Step 3: Share the Error

**Please share:**
1. The exact error message from Vercel logs
2. Which deployment failed (latest 2)
3. Any specific file mentioned in the error

## Quick Fixes Applied

✅ Removed unused `Link` imports from Games.tsx
✅ Removed unused `Link` imports from Players.tsx
✅ Build passes locally

**Next**: Check Vercel logs and share the specific error message!
