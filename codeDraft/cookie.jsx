const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../config/tokenGenerator');
const bcrypt = require('bcrypt');
const User = require('../../models/user/user.model');
const {
  credentialsValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const authController = {};

authController.login = async (req, res) => {
  await credentialsValidationMiddleware(req, res, async () => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const accessToken = generateAccessToken({
        userId: user._id,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        userId: user._id,
        role: user.role,
      });

      user.refreshToken = refreshToken;
      await user.save();

      res.setHeader('X-Access-Token', accessToken);
      res.setHeader('Authorization', refreshToken);
      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  });
};

const bcrypt = require('bcrypt');
const User = require('../../models/user/user.model');
const {
  credentialsValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const tokenMiddleware = require('../../middlewares/token.middleware');

const authController = {};

authController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    res.locals.user = user;
    // Generar los tokens y configurar res.locals.user
    tokenMiddleware(req, res, async () => {
      await user.save();

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
