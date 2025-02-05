passport.serializeUser((user, done) => {
  done(null, user.id); // Should store Discord user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    // Replace with your user lookup logic
    const user = await findUserById(id); 
    done(null, user);
  } catch (err) {
    done(err);
  }
}); 