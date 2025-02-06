const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Session configuration with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    crypto: {
      secret: process.env.SESSION_SECRET || 'your-secret-key'
    }
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.NODE_ENV === 'production' 
      ? '.onrender.com'  // This will work for your Render domain
      : 'localhost'
  },
  name: 'discord.sid'
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Session debugging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request to ${req.path}`);
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
});

module.exports = app;