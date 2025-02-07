const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require('dotenv').config();

const REDIRECT_URI = 'https://maxo-discord-bot-mvp.onrender.com/auth/discord/callback';

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
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('Discord auth callback received');
    console.log('Profile:', JSON.stringify(profile, null, 2));
    try {
      // Add tokens to user profile
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      
      return done(null, profile);
    } catch (error) {
      console.error('Auth error:', error);
      return done(error, null);
    }
  }
));

// Export both the configured passport instance and the REDIRECT_URI
module.exports = { passport, REDIRECT_URI }; 