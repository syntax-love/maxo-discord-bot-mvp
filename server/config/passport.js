const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_REDIRECT_URI,
    scope: ['identify', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    // In production, you might want to save the user to a database here
    return done(null, profile);
  }
));

module.exports = passport; 