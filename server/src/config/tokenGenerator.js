const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;
const generateAccessToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '15m' });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, secretKey);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
