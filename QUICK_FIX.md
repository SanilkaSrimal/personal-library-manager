# Quick Fix for Registration/Login Issues

## Immediate Checks

### 1. Verify Environment Variables in Vercel

**Backend Project (Vercel):**
- Go to: Vercel Dashboard → Your Backend Project → Settings → Environment Variables
- Verify these are set:
  - ✅ `MONGO_URI` - Your MongoDB Atlas connection string
  - ✅ `JWT_SECRET` - Any random secret string
  - ✅ `NODE_ENV=production`

**Frontend Project (Vercel):**
- Go to: Vercel Dashboard → Your Frontend Project → Settings → Environment Variables
- Verify:
  - ✅ `REACT_APP_API_URL` - Should be: `https://your-backend-url.vercel.app/api`
    - **Important**: Must include `/api` at the end!

### 2. Test Backend Health Endpoint

Open in browser or use curl:
```
https://your-backend-url.vercel.app/api/health
```

**Expected Response:**
```json
{"message":"Server is running","timestamp":"..."}
```

**If you get 404:**
- Check that backend is deployed correctly
- Verify the URL is correct

**If you get 503:**
- Database connection issue
- Check `MONGO_URI` environment variable
- Check MongoDB Atlas IP whitelist

### 3. Check MongoDB Atlas

1. **IP Whitelist:**
   - MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)

2. **Database User:**
   - MongoDB Atlas → Database Access
   - Verify user has read/write permissions
   - Check username and password in connection string

3. **Connection String Format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

### 4. Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try to register/login
4. Look for error messages
5. Check Network tab for failed requests

### 5. Common Fixes

**Fix 1: Update CORS in Backend**

Edit `server/api/index.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend-url.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

Then redeploy backend.

**Fix 2: Verify API URL**

In frontend `.env` or Vercel environment variables:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

**Fix 3: Check Database Connection**

Test connection string directly:
```bash
# Replace with your connection string
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
```

### 6. Quick Test Commands

**Test Signup:**
```bash
curl -X POST https://your-backend.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

**Test Login:**
```bash
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 7. Check Vercel Logs

1. Vercel Dashboard → Your Backend Project
2. Go to "Functions" tab
3. Click on recent function invocations
4. Check logs for errors

---

## Most Common Issues

1. **"Failed" with no details**
   - Check browser console (F12)
   - Check Network tab for API response
   - Check Vercel function logs

2. **"Database connection failed"**
   - Verify `MONGO_URI` is set correctly
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format

3. **"CORS error"**
   - Update CORS in `server/api/index.js`
   - Add frontend URL to allowed origins
   - Redeploy backend

4. **"Route not found"**
   - Verify `REACT_APP_API_URL` includes `/api`
   - Check backend is deployed
   - Test health endpoint

---

## Still Not Working?

1. Check all environment variables are set
2. Verify MongoDB Atlas is accessible
3. Test API endpoints directly with curl
4. Check Vercel deployment logs
5. Check browser console for detailed errors
