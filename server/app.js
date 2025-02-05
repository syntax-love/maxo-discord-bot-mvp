const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize passport configuration
require('./passportConfig');

const passport = require('passport');

const app = express();

// Use CORS as needed (adjust configuration for production)
app.use(cors({ origin: true, credentials: true }));

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // For local, ensure secure is false
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use the authentication routes
app.use('/auth', require('./auth'));

// Use API routes
app.use('/api', require('./api'));

// Serve static files from the built React dashboard
app.use(express.static(path.join(__dirname, '../dashboard/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dashboard/build', 'index.html'));
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
