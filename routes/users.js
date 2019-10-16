var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');

router.post('/register', auth.optional, users.register);
router.post('/login',auth.optional, users.login);

module.exports = router;
