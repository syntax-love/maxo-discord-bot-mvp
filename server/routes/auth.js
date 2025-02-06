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
  // Log the start of OAuth process
  console.log('Starting Discord OAuth process');
  
  passport.authenticate('discord', {
    scope: ['identify', 'email'],
    state: true,
    prompt: 'consent'
  })(req, res, next);
});

// OAuth callback route
router.get('/discord/callback', 
  handleAuth,
  (req, res) => {
    console.log('OAuth Callback - Session:', req.session);
    console.log('OAuth Callback - User:', req.user);
    
    if (req.user) {
      req.session.user = req.user;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
        }
        res.redirect('/dashboard');
      });
    } else {
      res.redirect('/?error=no_user');
    }
  }
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

module.exports = router; 