# Quick Vercel Deployment Guide

## 🚀 Fastest Method: Deploy Separately

### Step 1: Deploy Backend

1. **Go to Vercel Dashboard** → [vercel.com/new](https://vercel.com/new)
2. **Import your GitHub repository**
3. **Configure:**
   - Root Directory: `server`
   - Framework: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
4. **Environment Variables:**
   ```
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```
5. **Deploy** → Copy your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Add New Project** in Vercel
2. **Import same repository**
3. **Configure:**
   - Root Directory: `client`
   - Framework: Create React App (auto-detected)
4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```
   (Use the URL from Step 1)
5. **Deploy**

### Step 3: Update CORS (If Needed)

If you get CORS errors, update `server/api/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Step 4: Test

Visit your frontend URL and test the application!

---

## 📝 Environment Variables Checklist

**Backend:**
- ✅ `MONGO_URI` - MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Random secret string
- ✅ `NODE_ENV=production`

**Frontend:**
- ✅ `REACT_APP_API_URL` - Your backend URL + `/api`

---

## 🔧 Troubleshooting

**API not working?**
- Check `REACT_APP_API_URL` matches backend URL
- Verify CORS settings
- Check Vercel function logs

**Database errors?**
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format

**Build fails?**
- Check Node.js version (Vercel uses 18.x)
- Verify all dependencies in package.json
