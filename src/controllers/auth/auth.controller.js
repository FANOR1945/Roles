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

      res.set('X-Access-Token', accessToken);
      res.set('Authorization', refreshToken);

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

module.exports = authController;

authController.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Utiliza req.userId en lugar de req.user.id

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Perfil obtenido exitosamente',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

authController.logout = async (req, res) => {
  try {
    const id = req.params; // Obtener el ID del usuario del middleware de autenticación
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

module.exports = authController;
