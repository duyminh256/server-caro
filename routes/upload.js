
var express = require('express');
var router = express.Router();
const auth = require('../routes/auth');
const user = require('../controllers/userController')
var multer = require('multer');
const imageUploader = multer({ dest: 'images/' }); // (**)

router.post('/avatar',auth.required,imageUploader.single('avatar'),user.upload)
router.get('/:name',user.show)
module.exports = router;
