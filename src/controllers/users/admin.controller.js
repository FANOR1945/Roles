const {
  userValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const UserManagement = require('../../middlewares/userManagement.middleware');

const adminController = {};

adminController.createAdminUser = async (req, res) => {
  try {
    // Validar los datos del administrador
    await userValidationMiddleware(req, res, async () => {
      // Ejecutar el middleware para crear el usuario
      await UserManagement(req, res, async () => {
        // Ejecutar el middleware para generar los tokens

        const user = res.locals.user;

        user.refreshToken = tokens.refreshToken;
        await user.save();

        return res.status(201).json({
          message: 'Usuario creado con éxito',
          user: userWithRole,
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear administrador' });
  }
};

module.exports = adminController;
