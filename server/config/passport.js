const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://maxo-discord-bot-mvp.onrender.com/auth/discord/callback'  // Replace with your actual Render URL
  : 'http://localhost:3001/auth/discord/callback';

console.log('Discord OAuth Configuration:');
console.log('Client ID:', process.env.DISCORD_CLIENT_ID);
console.log('Redirect URI:', REDIRECT_URI);
console.log('Environment:', process.env.NODE_ENV);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
    scope: ['identify', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('Discord authentication successful');
    console.log('Profile:', profile);
    
    // Add tokens to user profile
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    
    return cb(null, profile);
  }
));

module.exports = passport; 