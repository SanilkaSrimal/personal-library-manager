# How to Check CORS Configuration

## Quick Browser Test

### Method 1: Browser Console (Easiest)

1. **Open your deployed app** in browser
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Run this command:**
   ```javascript
   fetch('https://personal-library-manager-nx1w.vercel.app/api/health', {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   })
   .then(r => r.json())
   .then(data => console.log('✅ CORS OK:', data))
   .catch(err => console.error('❌ CORS Error:', err))
   ```

**What to look for:**
- ✅ **Success**: You see `✅ CORS OK:` with the response data
- ❌ **CORS Error**: You see `❌ CORS Error:` with message like "CORS policy" or "blocked by CORS"

### Method 2: Network Tab

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Try to register/login** (or make any API call)
4. **Click on the failed request**
5. **Check the Response Headers:**
   - Look for `Access-Control-Allow-Origin` header
   - Should show your origin or `*`

**What to look for:**
- ✅ **Has `Access-Control-Allow-Origin` header**: CORS is configured
- ❌ **No `Access-Control-Allow-Origin` header**: CORS not working
- ❌ **Error in Console**: "CORS policy blocked" or similar

### Method 3: Test with curl

Open terminal/command prompt and run:

```bash
curl -H "Origin: https://personal-library-manager-nx1w.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://personal-library-manager-nx1w.vercel.app/api/health \
     -v
```

**What to look for:**
- ✅ **`Access-Control-Allow-Origin: *`** or your origin
- ✅ **`Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`**
- ✅ **`Access-Control-Allow-Headers: Content-Type, Authorization`**

## Check Current CORS Configuration

### In Your Code

Check `server/api/index.js`:

```javascript
app.use(cors({
  origin: function (origin, callback) {
    // Should allow your origin or all origins
    if (!origin || allowedOrigins === true || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Current Configuration:**
- ✅ **Production**: Allows ALL origins (for monorepo same-domain)
- ✅ **Development**: Allows `http://localhost:3000` and `http://localhost:5000`
- ✅ **Methods**: GET, POST, PUT, DELETE, OPTIONS
- ✅ **Headers**: Content-Type, Authorization
- ✅ **Credentials**: Enabled

## Common CORS Issues

### Issue 1: "CORS policy blocked"

**Symptoms:**
- Browser console shows: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"
- Network tab shows request failed

**Fix:**
- Check `server/api/index.js` CORS configuration
- Verify your origin is in allowed list
- For monorepo (same domain), should allow all origins in production

### Issue 2: "No 'Access-Control-Allow-Origin' header"

**Symptoms:**
- Response doesn't include CORS headers
- Request fails in browser

**Fix:**
- Make sure CORS middleware is before routes in `server/api/index.js`
- Verify CORS package is installed: `npm list cors` in server folder

### Issue 3: Preflight (OPTIONS) request fails

**Symptoms:**
- OPTIONS request returns 404 or error
- POST/PUT requests fail

**Fix:**
- CORS should handle OPTIONS automatically
- Verify `methods` includes 'OPTIONS' in CORS config

## Test CORS with Different Scenarios

### Test 1: Simple GET Request
```javascript
fetch('https://personal-library-manager-nx1w.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Test 2: POST Request (Like Login)
```javascript
fetch('https://personal-library-manager-nx1w.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### Test 3: Request with Authorization Header
```javascript
fetch('https://personal-library-manager-nx1w.vercel.app/api/auth/me', {
  headers: {
    'Authorization': 'Bearer your-token-here'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## Verify CORS Headers in Response

### Using Browser DevTools

1. Open Network tab
2. Make an API request
3. Click on the request
4. Check "Response Headers" section
5. Look for:
   - `Access-Control-Allow-Origin: *` (or your origin)
   - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type, Authorization`
   - `Access-Control-Allow-Credentials: true`

### Using curl

```bash
curl -I https://personal-library-manager-nx1w.vercel.app/api/health \
     -H "Origin: https://personal-library-manager-nx1w.vercel.app"
```

Look for `Access-Control-Allow-Origin` in the response headers.

## Quick CORS Checklist

- [ ] CORS middleware is installed (`npm list cors` shows cors package)
- [ ] CORS middleware is before routes in Express app
- [ ] CORS allows your origin (or all origins in production)
- [ ] CORS allows required methods (GET, POST, etc.)
- [ ] CORS allows required headers (Content-Type, Authorization)
- [ ] Credentials enabled if using cookies/auth
- [ ] OPTIONS requests are handled (automatic with CORS)

## Current Status

Based on your code:
- ✅ CORS middleware is configured
- ✅ Allows all origins in production (for monorepo)
- ✅ Allows localhost in development
- ✅ Methods include GET, POST, PUT, DELETE, OPTIONS
- ✅ Headers include Content-Type, Authorization
- ✅ Credentials enabled

**If you're still getting CORS errors:**
1. Check Vercel function logs for CORS-related errors
2. Verify the request is actually reaching the backend
3. Test with the browser console commands above
4. Check Network tab for actual response headers
