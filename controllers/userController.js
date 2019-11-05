var User = require('../models/users');
const passport = require("passport")

var fs = require('fs');
var path = require ('path');

exports.register = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "Some params is missing."
        })
    }
    const user = new User({
        email: req.body.email,
        username: req.body.username || req.body.email,
    })
    user.setPassword(req.body.password)
    user.save()
        .then(data => {
            res.send(data.toAuthJSON());
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
}
exports.login = (req, res, next) => {
    if (!req.body.email) {
        return res.status(500).send({
            message: "Email is require."
        });
    }

    if (!req.body.password) {
        return res.status(500).send({
            message: "Password is require."
        });
    }

    passport.authenticate('local', { session: false }, (err, passportUser) => {
        if (err) {
            return next(err);
        }
       
        if (passportUser) {
            const user = passportUser;
            return res.json({ user: user.toAuthJSON() });
        }
        return res.status(400).send({
            message: "Some thing went wrong."
        })
    })(req, res, next);
}
exports.loginFacebook = (req, res, next) =>{
    passport.authenticate('facebook-token', { session: false }, (err, passportUser) => {
        if (err) {
            return next(err);
        }
        if (passportUser) {
            User.findOne({facebookId:passportUser.id})
                .then(user=>{
                    if(!user){
                        user = new User({
                            username: passportUser.displayName,
                            email: passportUser.emails[0].value,
                            facebookId: passportUser.id
                        })
                    }else{
                        user.username = passportUser.displayName;
                        user.email = passportUser.emails[0].value;
                    }
                    user.save()
                    return res.json({ user: user.toAuthJSON() });
                })
        }else{
            return res.status(400).send({
                message: "Some thing went wrong."
            })
        }
    })(req, res, next);
}
exports.loginGoogle = (req, res, next) =>{
    passport.authenticate('google-token', { session: false }, (err, passportUser) => {
        if (err) {
            return next(err);
        }
        if (passportUser) {
            User.findOne({googleId:passportUser.id})
                .then(user=>{
                    if(!user){
                        user = new User({
                            username: passportUser.displayName,
                            email: passportUser.emails[0].value,
                            googleId: passportUser.id
                        })
                    }else{
                        user.username = passportUser.displayName;
                        user.email = passportUser.emails[0].value;
                    }
                    user.save()
                    return res.json({ user: user.toAuthJSON() });
                })
        }else{
            return res.status(400).send({
                message: "Some thing went wrong."
            })
        }
    })(req, res, next);
}



exports.me = (req, res) => {
    const { id } = req.payload;
    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            res.send(user);
        });
}
exports.edit = (req, res) => {
    const { id } = req.payload;
    const {username,password,email,age} = req.body
    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            user.email = email||user.email
            user.age = age
            user.username = username||user;
            if(password)
                user.setPassword(password)
            user.save()
            res.send(user)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while update the User."
            });
        });
}

exports.upload = (req, res) => {
    const { id } = req.payload;
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);
    let filename = newFullPath.split('/')[1]
    User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            user.url = filename
            user.save()
            res.send(user.url)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while update the User."
            });
    });
}

exports.show =  (req, res) => {
    const fileName = req.params.name;
    console.log('fileName', fileName);
    if (!fileName) {
        return res.send({
            status: false,
            message: 'no filename specified',
        })
    }
    res.sendFile(path.resolve(`./images/${fileName}`));
}