var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');
const passport = require("passport")
router.post('/register', auth.optional, users.register);
router.post('/login',auth.optional, users.login);
router.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    return res.json({ user: req });
      // console.log(req);
    // Successful authentication, redirect home.
    res.redirect('/');
  });
router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.picture.data);
    // Successful authentication, redirect home.
    // res.redirect('/');
  });
module.exports = router;
