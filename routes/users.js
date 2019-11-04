var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');
const passport = require("passport")
router.post('/register', auth.optional, users.register);
router.post('/login',auth.optional, users.login);
router.post('/update',auth.required,users.edit);
router.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user
    res.send(req.data? 200 : 401);
  }
);
router.post('/auth/google/token', passport.authenticate('google-token'),
 function(req, res) {
  res.send(req.data);
});
module.exports = router;
