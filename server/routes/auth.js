const express = require('express');
const passport = require('passport');
const router = express.Router();

// Discord OAuth routes
router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
  passport.authenticate('discord', { 
    failureRedirect: '/login',
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

// Check auth status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      isAuthenticated: true, 
      user: req.user 
    });
  } else {
    res.json({ 
      isAuthenticated: false 
    });
  }
});

module.exports = router; 