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

  // Se asigna el refreshToken al objeto de usuario en lugar de user.refreshToken = refreshToken
  user.refreshToken = refreshToken;

  // Guarda el usuario actualizado en la base de datos
  user.save();

  // Envía los tokens en las cabeceras de la respuesta
  res.setHeader('X-Access-Token', accessToken);

  // Envía el refreshToken en el cuerpo de la respuesta
  res.json({
    accessToken,
    refreshToken,
  });
};

module.exports = tokenGeneratorMiddleware;
