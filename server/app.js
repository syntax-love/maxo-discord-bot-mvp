const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const adminRoutes = require('./routes/admin');

const app = express();

app.use(express.json());
app.use(cors());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = {
    id: '123456789',
    username: 'TestUser',
    email: 'test@example.com'
  };
  
  next();
});

// API Routes first
app.use('/api/admin', adminRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../dashboard/dist')));

// Catch-all route AFTER API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dist/index.html'));
});

// Use the PORT provided by Render
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Static path:', path.join(__dirname, '../dashboard/dist'));
});

module.exports = app;