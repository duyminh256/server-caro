var express = require('express');
var router = express.Router();
const users = require('../controllers/userController.js');
const auth = require('../routes/auth');
/* GET home page. */
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});
router.get('/me', auth.required, users.me);
module.exports = router;
