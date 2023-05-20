const UserManagement = require('../../middlewares/userManagement.middleware');
const {
  userValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const adminController = {};

adminController.createAdminUser = async (req, res) => {
  try {
    // Validar los datos del administrador
    await userValidationMiddleware(req, res, async () => {
      // Ejecutar el middleware para crear el usuario
      await UserManagement(req, res, async () => {
        // Aquí puedes realizar cualquier otra operación adicional necesaria para el administrador
        // ...

        // Obtener el usuario creado desde el middleware createUserMiddleware
        const user = res.locals.user;

        // Retornar la respuesta con el usuario creado
        return res.status(201).json({
          message: 'Administrador creado con éxito',
          user,
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear administrador' });
  }
};

module.exports = adminController;
