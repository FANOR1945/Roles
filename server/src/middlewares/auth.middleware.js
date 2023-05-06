const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendAuthError = require('../utils/sendAuthError');
const {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} = require('../config/tokenGenerator');

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  const refreshToken = req.headers['authorization'];

  if (!accessToken && !refreshToken) {
    return sendAuthError(res);
  }

  try {
    let decodedAccessToken;
    if (accessToken) {
      decodedAccessToken = await verifyAccessToken(accessToken);
      req.userId = decodedAccessToken.userId; // Guarda el ID del usuario en la solicitud
      next();
    } else if (refreshToken) {
      const decodedRefreshToken = await verifyRefreshToken(refreshToken);

      const newAccessToken = await generateAccessToken({
        userId: decodedRefreshToken.userId,
      });
      const newRefreshToken = await generateRefreshToken({
        userId: decodedRefreshToken.userId,
      });
      req.userId = decodedRefreshToken.userId;
      res.set('X-Access-Token', newAccessToken);
      res.set('Authorization', newRefreshToken);
      next();
    }
  } catch (error) {
    return sendAuthError(res);
  }
};

module.exports = authMiddleware;
