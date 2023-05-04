const User = require('../models/user/user.model');
const sendAuthError = require('../utils/sendAuthError');

const checkPermissionsMiddleware = (permissionIds) => {
  return async (req, res, next) => {
    const userId = req.userId;
    const user = await User.findById(userId).populate('roleId');
    if (!user) {
      return sendAuthError(res);
    }
    const role = user.roleId;
    if (!role || !role.isActive) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
    const permissions = role.permissionIds.map((permission) =>
      permission._id.toString()
    );
    const hasPermission = permissionIds.some((permissionId) =>
      permissions.includes(permissionId)
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
  };
};

module.exports = checkPermissionsMiddleware;
