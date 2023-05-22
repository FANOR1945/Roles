const {
  generateAccessToken,
  generateRefreshToken,
} = require('../config/tokenGenerator');

const tokenGeneratorMiddleware = (req, res, next) => {
  const user = res.locals.user;

  const accessToken = generateAccessToken({
    userId: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.locals.tokens = {
    accessToken,
    refreshToken,
  };

  // Establecer la cookie HTTPOnly para el token de actualización
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: true, // Asegúrate de que la conexión sea HTTPS para habilitar esta opción en producción
  });

  next();
};

module.exports = tokenGeneratorMiddleware;
