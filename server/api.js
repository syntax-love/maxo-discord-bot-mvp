const express = require('express');
const ensureAuth = require('./ensureAuth'); // Middleware for authentication
const router = express.Router();

// Existing route that returns basic user info (if present)
router.get('/user', ensureAuth, (req, res) => {
  console.log('API /user accessed. Session user:', req.user);
  res.json(req.user);
});

// New endpoint: Return extended user details with subscription info
router.get('/user/details', ensureAuth, (req, res) => {
  // Dummy subscription data – replace with real data later
  const subscriptionDetails = {
    tier: 'Premium',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days out
    features: ['Unlimited commands', 'Exclusive roles', 'Priority support']
  };

  // Combine OAuth user data with subscription details
  const userDetails = {
    ...req.user,
    subscription: subscriptionDetails
  };

  res.json(userDetails);
});

router.get('/transactions', ensureAuth, (req, res) => {
  // Dummy transaction data array
  const dummyTransactions = [
    { id: 1, user: req.user.username, amount: 49.99, status: 'completed', timestamp: new Date().toISOString() },
    { id: 2, user: req.user.username, amount: 19.99, status: 'pending', timestamp: new Date().toISOString() },
    { id: 3, user: req.user.username, amount: 9.99, status: 'failed', timestamp: new Date().toISOString() }
  ];
  res.json(dummyTransactions);
});

router.get('/analytics', ensureAuth, (req, res) => {
  // Dummy analytics data (replace later with real aggregated data)
  res.json({
    totalRevenue: 1234.56,
    activeSubscriptions: 42,
    transactionsThisMonth: 25,
    newUsersThisWeek: 5
  });
});

router.get('/redirect', (req, res) => {
  res.redirect('/dashboard');
});

// Debug endpoint to inspect session
router.get('/session-test', (req, res) => {
  res.json({
    user: req.user || null,
    session: req.session
  });
});

module.exports = router;