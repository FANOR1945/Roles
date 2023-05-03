const Role = require('../models/role/role.model');

const checkPermissionsMiddleware = (permissionAlias) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user || !user.role) {
        return res.status(403).json({ message: "Access denied" });
      }
      const role = await Role.findById(user.role);
      if (
        !role ||
        !role.permissions ||
        !role.permissions.some(
          (permission) => permission.alias === permissionAlias
        )
      ) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
};



module.exports = checkPermissionsMiddleware;
