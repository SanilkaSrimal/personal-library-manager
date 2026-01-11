# Monorepo Deployment Fix

## Current Issue
Getting "Cannot connect to backend API" error when trying to register/login.

## Most Likely Causes

### 1. Backend Function Not Deployed
The serverless function might not be building/deploying correctly.

**Check:**
1. Go to Vercel Dashboard → Your Project
2. Check "Deployments" tab
3. Look for build errors
4. Check "Functions" tab - you should see `server/api/index.js` listed

**Fix:**
- Make sure `server/api/index.js` exists
- Verify `server/package.json` has all dependencies
- Check build logs for errors

### 2. Environment Variables Not Set
Backend needs MongoDB connection.

**Check:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verify these are set:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Any random string
   - `NODE_ENV=production`

**Fix:**
- Add missing environment variables
- Redeploy after adding

### 3. MongoDB Connection Issue
Database might not be accessible.

**Check:**
1. MongoDB Atlas → Network Access
2. Verify `0.0.0.0/0` is in IP whitelist
3. Check connection string format

**Fix:**
- Add `0.0.0.0/0` to IP whitelist
- Verify connection string includes username, password, and database name

### 4. Function Not Being Invoked
The routing might not be working.

**Test:**
1. Open browser console
2. Run: `fetch('/api/health').then(r => r.json()).then(console.log).catch(console.error)`
3. Check Network tab for the request

**If 404:**
- Function not deployed
- Check Vercel Functions tab

**If 503:**
- Database connection issue
- Check MongoDB settings

**If CORS error:**
- Already fixed in code (allows all origins in production)

## Quick Fix Steps

1. **Verify Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   JWT_SECRET=your-random-secret
   NODE_ENV=production
   ```

2. **Redeploy:**
   - Push changes to GitHub
   - Vercel will auto-deploy
   - OR manually trigger redeploy in Vercel dashboard

3. **Test Health Endpoint:**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return: `{"message":"Server is running",...}`

4. **Check Function Logs:**
   - Vercel Dashboard → Functions tab
   - Click on function invocations
   - Look for errors

## If Still Not Working

1. **Check Build Logs:**
   - Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check for build errors

2. **Check Function Logs:**
   - Vercel Dashboard → Functions
   - Look for runtime errors

3. **Test Locally First:**
   ```bash
   cd server
   npm install
   # Set .env file
   node api/index.js
   ```
   Then test: `curl http://localhost:5000/api/health`

4. **Verify File Structure:**
   ```
   server/
     api/
       index.js  ← Must exist
     config/
       db.js
     routes/
       authRoutes.js
     package.json
   ```

## Expected Behavior

After fix:
- `/api/health` returns `{"message":"Server is running"}`
- `/api/auth/signup` accepts POST requests
- `/api/auth/login` accepts POST requests
- Browser console shows successful API calls
