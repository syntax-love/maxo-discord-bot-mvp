const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'https://maxo-discord-bot-mvp.onrender.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = {
    id: '123456789',
    username: 'TestUser',
    email: 'test@example.com'
  };
  next();
});

// API Routes
app.get('/api/user', (req, res) => {
  res.json(req.user);
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalUsers: 100,
    activeSubscriptions: 50,
    revenueThisMonth: 1000
  });
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

// Use the PORT provided by Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static path:', path.join(__dirname, '../dashboard/dist'));
});

module.exports = app;