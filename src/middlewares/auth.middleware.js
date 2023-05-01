const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No estas Autorizado' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; // Guarda el ID del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'No estas Autorizado' });
  }
};

module.exports = authMiddleware;
