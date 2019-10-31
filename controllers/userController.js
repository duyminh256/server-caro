var User = require('../models/users');
const passport = require("passport")

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
            res.send(data);
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
exports.loginFacebook = (req, res, next) => {
    passport.authenticate('facebook', {scope: ['email']})
}
exports.loginFacebookCallBack = (req, res, next) => {
    console.log(req);
}



exports.me = (req, res) => {
    const { id } = req.payload;
    return User.findById(id)
        .then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            return res.json({ user: user.toAuthJSON() });
        });
}
