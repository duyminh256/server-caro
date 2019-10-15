const passport    = require('passport');


const LocalStrategy = require('passport-local').Strategy;

var User = require("../models/users")

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
      User.findOne({ email })
      .then((user) => {
          if (!user || !user.validatePassword(password)) {
              return done(null, false, { errors: { 'email or password': 'is invalid' } });
          }
          return done(null, user);
      }).catch(done);
    }
));