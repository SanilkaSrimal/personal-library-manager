# Quick Setup Guide

## Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/personal-library-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

Start MongoDB (if local):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
```

Start client:
```bash
npm start
```

### 3. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. Create an account (Sign Up)
2. Search for books on the landing page
3. Save books to your library
4. Manage reading status and reviews in My Library

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For MongoDB Atlas, use connection string format: `mongodb+srv://user:password@cluster.mongodb.net/dbname`

### Port Already in Use
- Change PORT in server/.env
- Update REACT_APP_API_URL in client/.env if needed

### CORS Errors
- Ensure backend is running on port 5000
- Check proxy setting in client/package.json
