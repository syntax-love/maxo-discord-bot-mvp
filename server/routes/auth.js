const express = require('express');
const passport = require('passport');
const router = express.Router();

// Discord OAuth routes
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/login'
  }),
  (req, res) => {
    console.log('Auth successful, user:', req.user);
    res.redirect('/dashboard');
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

// Check auth status
router.get('/status', (req, res) => {
  console.log('Checking auth status');
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());
  
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

module.exports = router; 