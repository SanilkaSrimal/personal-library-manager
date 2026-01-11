# Personal Library Manager

A full-stack MERN (MongoDB, Express, React, Node.js) web application that allows users to search books using the Google Books API, create accounts, and manage their personal library with CRUD operations.

## 🚀 Features

### Public Features (No Login Required)
- **Search Books**: Search for books by title, author, or keyword using Google Books API
- **View Search Results**: Browse book results with details including:
  - Title and subtitle
  - Author(s)
  - Description
  - Thumbnail image
  - Link to view on Google Books

### User Authentication
- **Sign Up**: Create an account with username, email, and password
- **Login**: Secure authentication using JWT tokens
- **Protected Routes**: Only authenticated users can access library features

### Personal Library Management (CRUD)
- **CREATE**: Save books from search results to personal library
- **READ**: View all saved books in "My Library" page
- **UPDATE**: 
  - Add or edit personal reviews
  - Change reading status (Reading, Completed, Want to Read)
- **DELETE**: Remove books from personal library

### Advanced Features
- **Axios Interceptors**: 
  - Request interceptor automatically attaches JWT token to all API calls
  - Response interceptor handles 401 errors by auto-logging out and redirecting
- **Secure Authentication**: 
  - Passwords hashed with bcryptjs
  - JWT-based authentication
  - Protected API routes with middleware

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management for authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JSON Web Tokens (JWT)** - Token-based authentication
- **bcryptjs** - Password hashing

### External API
- **Google Books API** - Book search and information

## 📁 Project Structure

```
personal-library-manager/
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/
│       │   └── axios.js              # Axios instance with interceptors
│       ├── components/
│       │   ├── Navbar.js             # Navigation component
│       │   ├── Navbar.css
│       │   ├── BookCard.js           # Book display component
│       │   ├── BookCard.css
│       │   └── ProtectedRoute.js     # Route protection component
│       ├── context/
│       │   └── AuthContext.js        # Authentication context
│       ├── pages/
│       │   ├── Landing.js            # Landing page
│       │   ├── Landing.css
│       │   ├── Search.js             # Search page
│       │   ├── Search.css
│       │   ├── Login.js              # Login page
│       │   ├── Signup.js             # Signup page
│       │   ├── Auth.css              # Shared auth styles
│       │   ├── Library.js            # My Library page
│       │   └── Library.css
│       ├── services/
│       │   ├── authService.js        # Authentication API calls
│       │   ├── bookService.js        # Library CRUD API calls
│       │   └── googleBooksService.js # Google Books API integration
│       ├── App.js                    # Main app component
│       ├── App.css
│       ├── index.js                   # Entry point
│       └── index.css
│
├── server/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Auth logic (signup, login)
│   │   └── bookController.js         # Library CRUD logic
│   ├── middleware/
│   │   └── auth.js                   # JWT verification middleware
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   └── Book.js                   # Book schema
│   ├── routes/
│   │   ├── authRoutes.js             # Auth endpoints
│   │   └── bookRoutes.js             # Library endpoints
│   ├── server.js                     # Express server entry point
│   └── package.json
│
├── .env                              # Environment variables (create from .env.example)
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Books API Key (optional, but recommended for production)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/personal-library-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_BOOKS_API_KEY=your-google-books-api-key
```

4. Start MongoDB (if running locally):
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

5. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `client` directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The client will run on `http://localhost:3000`

## 🔐 Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing (use a strong random string in production)
- `GOOGLE_BOOKS_API_KEY` - Google Books API key (optional, not required for basic functionality)

### Client (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Books (All Protected)
- `GET /api/books` - Get all books in user's library
- `POST /api/books` - Save a book to library
- `GET /api/books/:id` - Get a single book
- `PUT /api/books/:id` - Update a book (reading status, review)
- `DELETE /api/books/:id` - Delete a book from library

## 🏗️ Architectural Decisions

### Axios Interceptors
- **Request Interceptor**: Automatically attaches JWT token from localStorage to all API requests, eliminating the need to manually add headers in every service call.
- **Response Interceptor**: Centralized error handling for 401 Unauthorized responses. Automatically logs out users and redirects to login page when token expires or is invalid.

### Authentication Flow
1. User signs up/logs in → JWT token stored in localStorage
2. Token automatically attached to all API requests via interceptor
3. Protected routes check authentication status via Context API
4. Server validates token on each protected endpoint

### Database Design
- **User Model**: Stores user credentials with hashed passwords
- **Book Model**: Stores saved books with user reference, reading status, and personal reviews
- Unique index on `(user, googleBooksId)` prevents duplicate book saves

### Security Measures
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with 30-day expiration
- Protected routes verify user ownership before allowing updates/deletes
- Input validation on both client and server

## 🎨 UI/UX Features
- Responsive design for mobile and desktop
- Loading indicators during API calls
- Error messages for failed operations
- Clean, modern interface
- Smooth transitions and hover effects

## 🚧 Future Enhancements (Optional)
- Pagination or infinite scroll for search results
- Search filters (Free E-books, Print Type)
- Dark mode toggle
- Unit testing with Jest/Supertest
- Book rating system
- Reading progress tracking
- Export library to CSV/JSON

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

### Running Both Servers
In separate terminal windows:
1. Terminal 1: `cd server && npm run dev`
2. Terminal 2: `cd client && npm start`

### Testing
1. Create an account via Sign Up
2. Search for books on the landing page
3. Save books to your library
4. Manage reading status and reviews in My Library

---

**Note**: Make sure MongoDB is running before starting the server. For production deployment, use environment variables and secure JWT secrets.
