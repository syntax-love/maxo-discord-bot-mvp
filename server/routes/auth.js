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
    console.log('Auth successful, session:', req.session);
    console.log('Auth successful, user:', req.user);
    
    // Set session explicitly
    req.session.user = req.user;
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      console.log('Session saved successfully');
      res.redirect('/dashboard');
    });
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
  console.log('Status check - Session:', req.session);
  console.log('Status check - User:', req.user);
  console.log('Status check - Is Authenticated:', req.isAuthenticated());
  
  // Check both session.user and passport.user
  const isAuthenticated = req.isAuthenticated() || !!req.session.user;
  const user = req.user || req.session.user;
  
  res.json({
    isAuthenticated,
    user
  });
});

module.exports = router; 