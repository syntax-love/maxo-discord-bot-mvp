const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Get the domain from environment
const DOMAIN = process.env.NODE_ENV === 'production' 
  ? 'maxo-discord-bot-mvp.onrender.com'  // Replace with your actual Render domain
  : 'localhost';

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://maxo-discord-bot-mvp.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  },
  name: 'discord.sid'
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Serve static files
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

// Add detailed MongoDB connection logging
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Test the connection
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('MongoDB ping successful');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Log more details about the connection attempt
    console.log('MongoDB URI format check:', process.env.MONGODB_URI.startsWith('mongodb+srv://'));
    console.log('MongoDB URI includes database:', process.env.MONGODB_URI.includes('discord-dashboard'));
  });

// Add connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB error event:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Domain:', DOMAIN);
});

app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        statusCode: err.statusCode
    });
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

module.exports = app;