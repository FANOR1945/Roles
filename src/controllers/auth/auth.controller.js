const bcrypt = require("bcrypt");
const User = require("../../models/user/user.model");
const {
  credentialsValidationMiddleware,
} = require("../../middlewares/validation.middleware");

const tokenGeneratorMiddleware = require("../../middlewares/generator.middleware");
const authController = {};

authController.login = async (req, res) => {
  await credentialsValidationMiddleware(req, res, async () => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.locals.user = user;
      tokenGeneratorMiddleware(req, res, async () => {
        await user.save();

        // Devuelve el token de acceso en el cuerpo de la respuesta
        return res.status(200).json({
          message: "Inicio de sesión exitoso",

          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken: res.locals.tokens.accessToken,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });
};

authController.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // Utiliza req.userId en lugar de req.user.id

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({
      message: "Perfil obtenido exitosamente",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

authController.logout = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    user.refreshToken = undefined;
    await user.save();

    return res.status(200).json({
      message: "Sesión cerrada exitosamente",
      logout: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cerrar sesión" });
  }
};

module.exports = authController;
