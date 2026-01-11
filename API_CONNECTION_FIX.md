# API Connection Fix

## Problem
You can search books (Google Books API works) but registration/login fails with "Unable to connect to server".

## Solution

### If Deploying as Monorepo (Single Project)
The frontend will automatically use `/api` as the base URL. No environment variable needed!

**Just deploy and it should work.**

### If Deploying Separately (Two Projects)

1. **Deploy Backend First**
   - Get your backend URL: `https://your-backend.vercel.app`

2. **Set Frontend Environment Variable**
   - Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend.vercel.app/api`
   - **Important**: Must include `/api` at the end!

3. **Redeploy Frontend**
   - After setting the environment variable, trigger a new deployment

## How to Check

1. **Open Browser Console** (F12)
2. **Look for this message:**
   ```
   🔗 API Base URL: /api
   ```
   or
   ```
   🔗 API Base URL: https://your-backend.vercel.app/api
   ```

3. **Try to register/login**
4. **Check Console for detailed error:**
   - It will show the full URL being called
   - It will show the error code and details

## Common Issues

### Issue: Still getting "Unable to connect"
- **Check**: Browser console shows what URL is being used
- **If shows**: `http://localhost:5000/api` → Environment variable not set
- **If shows**: `/api` → Backend not deployed or routing issue
- **If shows**: `https://wrong-url.vercel.app/api` → Wrong URL in environment variable

### Issue: Backend deployed but still not working
1. Test backend directly:
   ```
   https://your-backend.vercel.app/api/health
   ```
   Should return: `{"message":"Server is running"}`

2. Check Vercel Functions tab for errors

3. Verify MongoDB connection in backend logs

## Quick Test

Open browser console and run:
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this works, the backend is accessible. If it fails, check backend deployment.
