const checkPermissionsMiddleware = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.permissions || !user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = checkPermissionsMiddleware;
