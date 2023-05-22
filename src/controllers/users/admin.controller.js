const {
  userValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const userManagementMiddleware = require('../../middlewares/userManagement.middleware');
const tokenGeneratorMiddleware = require('../../middlewares/generator.middleware');

const adminController = {};

adminController.createAdminUser = async (req, res) => {
  try {
    await userValidationMiddleware(req, res, async () => {
      await userManagementMiddleware(req, res, async () => {
        await tokenGeneratorMiddleware(req, res, async () => {
          const user = res.locals.user;
          const tokens = res.locals.tokens;

          user.refreshToken = tokens.refreshToken;
          await user.save();

          return res.status(201).json({
            message: 'Administrador creado con éxito',
            user,
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear administrador' });
  }
};

module.exports = adminController;
