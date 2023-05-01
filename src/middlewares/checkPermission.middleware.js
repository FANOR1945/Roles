const checkPermissionsMiddleware = (permission) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Acceso Denegado' });
    }

    const hasPermission = user.role.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
module.exports = checkPermissionsMiddleware;
