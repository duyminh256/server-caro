const jwt = require('express-jwt');
const key = require('../config/index')
const getTokenFromHeaders = (req) => {
  const { authorization } = req.headers;
  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: key.JWT_KEY,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: key.JWT_KEY,
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;