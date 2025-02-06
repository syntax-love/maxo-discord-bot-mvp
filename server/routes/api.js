const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user info
router.get('/user', isAuthenticated, (req, res) => {
  res.json(req.user);
});

// Get dashboard stats
router.get('/stats', isAuthenticated, (req, res) => {
  // Placeholder stats - replace with real data
  res.json({
    totalUsers: 100,
    activeSubscriptions: 50,
    revenueThisMonth: 1000
  });
});

module.exports = router; 