# Vercel Deployment Guide

This guide will walk you through deploying your Personal Library Manager MERN application to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas Account** - For cloud database (or use your existing MongoDB setup)

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

If not already done, push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2 Update .gitignore

Make sure `.gitignore` includes:
- `node_modules/`
- `.env` files
- `build/` (for client)

---

## Step 2: Set Up MongoDB Atlas (If Not Already Done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
4. Whitelist IP addresses (add `0.0.0.0/0` for Vercel)

---

## Step 3: Deploy to Vercel (Recommended: Separate Deployments)

### Option A: Deploy Frontend and Backend Separately (EASIEST)

#### 3.1 Deploy Backend First

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure Backend Project:
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

5. **Set Environment Variables** (Settings → Environment Variables):
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-library-manager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   ```

6. **Create API Route**: 
   - In Vercel, create `server/api/index.js` (already created for you)
   - This file exports the Express app for serverless functions

7. Click **"Deploy"** and note your backend URL (e.g., `https://your-backend.vercel.app`)

#### 3.2 Deploy Frontend

1. Click **"Add New Project"** again in Vercel
2. Import the same GitHub repository
3. Configure Frontend Project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `build` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```
   (Replace with your actual backend URL from step 3.1)

5. Click **"Deploy"**

### Option B: Deploy as Monorepo (Single Project)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `cd server && npm install && cd ../client && npm install`

5. **Set Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-library-manager
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=production
   REACT_APP_API_URL=https://your-project.vercel.app/api
   ```

6. **Important**: After first deployment, update `REACT_APP_API_URL` with your actual Vercel URL

7. Click **"Deploy"**

---

## Step 4: Alternative - Backend on Railway/Render

If you prefer to use Railway or Render for backend:

### Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add service → Select `server` folder
5. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=5000`
6. Railway will provide a URL like `https://your-app.railway.app`

### Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Set environment variables
6. Render will provide a URL

### Deploy Frontend to Vercel

1. Follow Step 3.2 above
2. Set `REACT_APP_API_URL` to your Railway/Render backend URL

---

## Step 6: Update CORS Settings

If deploying separately, update `server/server.js` CORS:

```javascript
app.use(cors({
  origin: [
    "https://your-frontend.vercel.app",
    "http://localhost:3000" // for local development
  ],
  credentials: true
}));
```

---

## Step 7: Verify Deployment

1. Visit your Vercel URL
2. Test the application:
   - Sign up/Login
   - Search for books
   - Save books to library
   - Test dark mode toggle

---

## Troubleshooting

### Issue: API calls failing
- Check `REACT_APP_API_URL` environment variable
- Verify CORS settings in backend
- Check Vercel function logs

### Issue: Database connection errors
- Verify MongoDB Atlas connection string
- Check IP whitelist (should include `0.0.0.0/0`)
- Verify environment variables are set correctly

### Issue: Build failures
- Check Node.js version (Vercel uses Node 18.x by default)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### Issue: 404 errors on routes
- Verify `vercel.json` rewrites are correct
- Check that React Router is using BrowserRouter (not HashRouter)

---

## Environment Variables Summary

**Backend (Server):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (optional, Vercel handles this)
- `NODE_ENV` - Set to `production`

**Frontend (Client):**
- `REACT_APP_API_URL` - Backend API URL (e.g., `https://your-project.vercel.app/api`)

---

## Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] MongoDB Atlas connection working
- [ ] CORS configured for production URL
- [ ] Frontend API URL points to backend
- [ ] Test user registration
- [ ] Test user login
- [ ] Test book search
- [ ] Test saving books
- [ ] Test dark mode toggle
- [ ] Verify all routes work correctly

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test API endpoints directly using Postman or curl
