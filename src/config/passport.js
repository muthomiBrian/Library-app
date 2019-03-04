const passport = require('passport');

const localStrategy = require('./strategies/local.strategy')();

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  // Store user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
