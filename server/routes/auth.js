const express = require('express');
const passport = require('passport');
const router = express.Router();

// Add error handling middleware
const handleAuth = (req, res, next) => {
  passport.authenticate('discord', { 
    failureRedirect: '/',
    successRedirect: '/dashboard',
    failWithError: true
  })(req, res, (err) => {
    if (err) {
      console.error('Authentication Error:', err);
      return res.redirect('/?error=auth_failed');
    }
    next();
  });
};

// Initial Discord OAuth route
router.get('/discord', (req, res, next) => {
  console.log('Starting Discord OAuth...');
  passport.authenticate('discord', {
    scope: ['identify', 'email'],
    prompt: 'consent'
  })(req, res, next);
});

// OAuth callback route
router.get('/discord/callback',
  (req, res, next) => {
    console.log('OAuth callback received');
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);
    next();
  },
  passport.authenticate('discord', {
    failureRedirect: '/?error=auth_failed',
    successRedirect: '/dashboard'
  })
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.redirect('/');
  });
});

// Status check route
router.get('/status', (req, res) => {
  console.log('Status Check - Session:', req.session);
  console.log('Status Check - User:', req.user);
  console.log('Status Check - Is Authenticated:', req.isAuthenticated());
  
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null,
    session: req.session
  });
});

// Add a debug route
router.get('/debug', (req, res) => {
  res.json({
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    cookies: req.cookies
  });
});

module.exports = router; 