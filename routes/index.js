var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/me', auth.required, users.me);
module.exports = router;
