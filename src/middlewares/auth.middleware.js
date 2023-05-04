const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendAuthError = require('../utils/sendAuthError');
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return sendAuthError(res);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; // Guarda el ID del usuario en la solicitud
    next();
  } catch (error) {
    return sendAuthError(res);
  }
};

module.exports = authMiddleware;

module.exports = authMiddleware;
