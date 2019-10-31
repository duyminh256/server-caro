const passport    = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
var User = require("../models/users")
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "232902383143-j7bcjlt3kct38i65eftosmt24kcb5s45.apps.googleusercontent.com",
    clientSecret: "RNPH0fAqoeV4ZABOBhkK00Nx",
    callbackURL: "http://localhost:3000/user/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    const user = new User({ googleId: profile.id })
    // user.save()
    //     .then((err,user)=> {return cb(err, user)})
  }
));
passport.use(new FacebookStrategy({
  clientID: 466304360645777,
  clientSecret: "27ebdebaf086ac9a5ac30a76810f2a67",
  callbackURL: "http://localhost:3000/user/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));
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
