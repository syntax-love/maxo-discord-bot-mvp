const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const strategy = new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'email'],
    state: true // Enable state parameter for CSRF protection
  },
  function(accessToken, refreshToken, profile, done) {
    // Log the OAuth process
    console.log('Discord OAuth callback received');
    console.log('Profile:', profile);
    
    // Add tokens to the profile
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    
    return done(null, profile);
  }
);

// Add error handling
strategy.error = function(err) {
  console.error('Discord Strategy Error:', err);
};

passport.use(strategy);

module.exports = passport; 