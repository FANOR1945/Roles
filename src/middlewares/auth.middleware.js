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
      req.userId = decodedAccessToken.userId;
      next();
    } else if (refreshToken) {
      const decodedRefreshToken = await verifyRefreshToken(refreshToken);
      req.userId = decodedRefreshToken.userId; // Assuming the user ID is stored in decodedRefreshToken.userId
      const newAccessToken = await generateAccessToken({
        userId: decodedRefreshToken.userId,
      });
      const newRefreshToken = await generateRefreshToken({
        userId: decodedRefreshToken.userId,
      });
      res.set('X-Access-Token', newAccessToken);
      res.set('Authorization', newRefreshToken);
      next();
    }
  } catch (error) {
    return sendAuthError(res);
  }
};

module.exports = authMiddleware;
