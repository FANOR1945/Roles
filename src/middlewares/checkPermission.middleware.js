const User = require('../models/user/user.model');
const Role = require('../models/role/role.model');

const checkPermissionMiddleware = (permissions) => async (req, res, next) => {
  try {
    // Obtener el usuario y su rol con permisos correspondientes
    const user = await User.findById(req.userId).populate('role');

    // Verificar si el usuario tiene un rol asignado
    if (!user.role || user.role.length === 0) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para realizar esta acción' });
    }

    // Verificar si el rol tiene los permisos necesarios
    const role = await Role.findById(user.role[0]).populate('permissions');
    if (
      !role.permissions ||
      !role.permissions.some((permission) =>
        permissions.includes(permission.alias)
      )
    ) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para realizar esta acción' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al verificar permisos' });
  }
};

module.exports = checkPermissionMiddleware;
