# Troubleshooting Deployment Issues

## Common Issues and Solutions

### Issue: Registration/Login Fails

#### 1. Check Environment Variables

**Backend Environment Variables (in Vercel):**
- `MONGO_URI` - Must be set correctly
- `JWT_SECRET` - Must be set
- `NODE_ENV=production`

**Frontend Environment Variables:**
- `REACT_APP_API_URL` - Must point to your backend URL + `/api`
  - Example: `https://your-backend.vercel.app/api`

#### 2. Check Database Connection

**MongoDB Atlas:**
1. Go to MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Add `0.0.0.0/0` to allow all IPs (for Vercel)
4. Verify connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

#### 3. Check CORS Settings

If you get CORS errors, update `server/api/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

#### 4. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your backend project
3. Go to "Functions" tab
4. Click on a function execution
5. Check logs for errors

#### 5. Test API Endpoints Directly

Use curl or Postman to test:

```bash
# Test health endpoint
curl https://your-backend.vercel.app/api/health

# Test signup
curl -X POST https://your-backend.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

### Issue: "Failed" Message with No Details

1. **Check Browser Console** (F12 → Console tab)
2. **Check Network Tab** (F12 → Network tab)
   - Look for failed requests
   - Check response status and body
3. **Check Vercel Logs** for backend errors

### Issue: Routes Not Found (404)

**For Separate Deployments:**
- Backend: Root directory should be `server`
- Frontend: Root directory should be `client`
- API calls should go to: `https://your-backend.vercel.app/api/auth/signup`

**For Monorepo:**
- Check `vercel.json` configuration
- Verify rewrites are correct

### Issue: Database Connection Timeout

1. **Check MongoDB Atlas IP Whitelist**
   - Must include `0.0.0.0/0`
2. **Check Connection String**
   - Must include username and password
   - Must be properly URL encoded
3. **Check Database User Permissions**
   - User must have read/write permissions

### Quick Debug Steps

1. **Test Health Endpoint:**
   ```
   https://your-backend.vercel.app/api/health
   ```
   Should return: `{"message":"Server is running"}`

2. **Check Environment Variables:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Verify all are set for Production

3. **Check Build Logs:**
   - Vercel Dashboard → Deployments → Click on deployment → View Build Logs

4. **Check Function Logs:**
   - Vercel Dashboard → Project → Functions tab
   - Look for errors in recent invocations

### Common Error Messages

**"Database connection failed"**
- Check `MONGO_URI` environment variable
- Verify MongoDB Atlas IP whitelist
- Check connection string format

**"Route not found"**
- Verify `REACT_APP_API_URL` includes `/api`
- Check that backend routes are mounted correctly
- Verify Vercel routing configuration

**"CORS error"**
- Update CORS settings in `server/api/index.js`
- Add frontend URL to allowed origins

**"Invalid credentials"**
- Check password hashing (should work automatically)
- Verify user exists in database
- Check JWT_SECRET is set

---

## Testing Locally Before Deployment

1. **Test Backend Locally:**
   ```bash
   cd server
   npm install
   # Set .env file with MONGO_URI and JWT_SECRET
   npm start
   ```

2. **Test Frontend Locally:**
   ```bash
   cd client
   npm install
   # Set .env file with REACT_APP_API_URL=http://localhost:5000/api
   npm start
   ```

3. **Test API Endpoints:**
   - Use Postman or curl
   - Test signup and login endpoints
   - Verify responses

---

## Still Having Issues?

1. Check Vercel deployment logs
2. Check browser console for frontend errors
3. Check Network tab for API request/response details
4. Verify all environment variables are set
5. Test API endpoints directly with curl/Postman
6. Check MongoDB Atlas connection and permissions
