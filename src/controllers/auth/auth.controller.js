const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../config/tokenGenerator');
const bcrypt = require('bcrypt');
const User = require('../../models/user/user.model');
const {
  userValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const authController = {};
authController.login = async (req, res) => {
  await userValidationMiddleware(req, res, async () => {
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
        id: user._id,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        id: user._id,
        role: user.role,
      });

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        message: 'Inicio de sesión exitoso',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  });
};

module.exports = authController;
