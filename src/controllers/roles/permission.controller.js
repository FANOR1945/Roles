const Permission = require('../../models/roles/permission.model');
const permissionController = {};

permissionController.createPermission = async (req, res, next) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

permissionController.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

permissionController.getPermission = async (req, res, next) => {
  try {
    const permission = await Permission.findOne({ name: req.params.name });
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, message: 'Permission not found' });
    }
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

permissionController.updatePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true }
    );
    if (!permission) {
      return res
        .status(404)
        .json({ success: false, message: 'Permission not found' });
    }
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

module.exports = permissionController;
