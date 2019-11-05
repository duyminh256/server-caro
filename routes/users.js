var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');
const passport = require("passport")
router.post('/register', auth.optional, users.register);
router.post('/login',auth.optional, users.login);
router.post('/update',auth.required,users.edit);
router.post('/auth/facebook/token',users.loginFacebook);
router.post('/auth/google/token', users.loginGoogle);
module.exports = router;
