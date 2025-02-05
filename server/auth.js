const express = require('express');
const passport = require('passport');

const router = express.Router();

// Start the Discord OAuth flow
router.get('/discord', passport.authenticate('discord'));

// OAuth callback URl - on success, redirect to the dashboard; on failure, redirect to /auth/discord
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
    console.log('OAuth callback reached. Authenticated user:', req.user);
    res.redirect('/dashboard');
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;