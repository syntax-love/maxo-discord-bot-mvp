const express = require('express');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

// Returns the authenticated user's Discord profile
router.get('/user', ensureAuth, (req, res) => {
    res.json(req.user);
});

// New endpoint: Return recent transactions (dummy data)
router.get('/transactions', ensureAuth, (req, res) => {
  // Dummy transactions; later, you can replace this with database data or calls to an external service.
  const dummyTransactions = [
    { 
      id: 1,
      user: req.user.username,
      amount: 99.99,
      status: 'completed',
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      user: req.user.username,
      amount: 19.99,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
  ];
  res.json(dummyTransactions);
});

// Additional API endpoints can be defined here for dashboard features

module.exports = router;
