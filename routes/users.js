var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');

router.get('/me', auth.optional, users.me);
router.post('/register', auth.optional, users.register);
router.post('/login',auth.optional, users.login);

module.exports = router;
