const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fs = require('fs');
const helmet = require('helmet');
const logger = require('./logger');

// Initialize passport configuration
require('./passportConfig');

const passport = require('passport');

const app = express();

// Use CORS as needed (adjust configuration for production)
app.use(cors({ origin: true, credentials: true }));

// Use session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true
    }
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use the authentication routes
app.use('/auth', require('./auth'));

// Use API routes
app.use('/api', require('./api'));

// Use helmet middleware
app.use(helmet());

// Determine the absolute path to the dashboard build folder.
// This assumes your structure is as follows:
//
// project/
// ├── dashboard/
// │   └── build/
// └── server/
//     └── app.js
//
// Using process.cwd() allows us to reliably locate the folder even if __dirname is not as expected.
const buildPath = path.join(process.cwd(), 'dashboard', 'dist');
console.log('Final verified path:', buildPath);

// Add this before static file serving
console.log('Current directory structure:');
fs.readdir(process.cwd(), (err, files) => {
  if (err) console.error(err);
  else console.log('Root contents:', files);
});

// Verify build directory exists
if (!fs.existsSync(buildPath)) {
  console.error('FATAL: Missing dist at', buildPath);
  process.exit(1);
}

// Serve static files from the React app
app.use(express.static(buildPath));

// Handle client-side routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
logger.info(`Server is running on port ${PORT}`);
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
