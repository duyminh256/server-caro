
var express = require('express');
var router = express.Router();
const auth = require('../routes/auth');
const user = require('../controllers/userController')
var key = require('../config/index')

//cloudinary
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
cloudinary.config({cloud_name: "dpsdkyleb",api_key:649252332669658,api_secret: "8ZfEWNU8eJGybHofn3lUya2qdVk"});

const storage = cloudinaryStorage({cloudinary: cloudinary,folder: "demo",allowedFormats: ["jpg", "png"],transformation: [{ width: 5000, height: 5000, crop: "limit" }]});

const parser = multer({ storage: storage });

router.post('/avatar',auth.required,parser.single('avatar'),user.upload)
router.get('/:name',user.show)
module.exports = router;
