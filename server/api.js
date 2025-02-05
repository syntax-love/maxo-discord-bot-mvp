const express = require('express');
const ensureAuth = require('./ensureAuth');

const router = express.Router();

// Returns the authenticated user's Discord profile
router.get('/user', ensureAuth, (req, res) => {
    res.json(req.user);
});

// Additional API endpoints can be defined here for dashboard features

module.exports = router;
