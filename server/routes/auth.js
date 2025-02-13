const express = require('express');
const router = express.Router();
const cors = require('cors');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Simple auth token for development
const DEV_TOKEN = 'dev_admin_token';

router.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

router.post('/login', (req, res) => {
  // For development, always authenticate
  res.json({
    token: DEV_TOKEN,
    user: {
      id: 'dev_user',
      username: 'Admin',
      avatar: null
    }
  });
});

router.get('/verify', (req, res) => {
  // For development, always verify
  res.json({
    user: {
      id: 'dev_user',
      username: 'Admin',
      avatar: null
    }
  });
});

module.exports = router; 