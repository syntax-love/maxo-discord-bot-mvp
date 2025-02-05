const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
require ('dotenv').config();

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
    console.log('Discord profile received:', profile);
    // For MVP purposes, simply pass the profile along.
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log('Deserializing user:', obj.id);
    done(null, obj);
});

module.exports = passport;

