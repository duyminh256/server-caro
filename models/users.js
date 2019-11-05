var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const key = require("../config/index")

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true},
    email:{type:String,require: true},
    age:{type:String},
    url:{type:String},
    passwordHash:{type:String,require:true},
    googleId:{type:String},
    facebookId:{type:String}
});

UserSchema.methods.setPassword = function (password) {
    this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    },key.JWT_KEY);
}

UserSchema.methods.toAuthJSON = function () {
    return {
        username: this.username,
        token: this.generateJWT(),
    };
};
module.exports = mongoose.model('User', UserSchema);