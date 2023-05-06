const Permission = require('../../models/permission/permission.model');
const permissionController = {};

permissionController.createPermission = async (req, res, next) => {
  try {
    const { name, alias, isActive } = req.body;
    const permission = await Permission.create({ name, alias, isActive });
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};
permissionController.getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find({}, 'name alias isActive');
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

permissionController.getPermission = async (req, res) => {
  try {
    const permission = await Permission.findOne({ alias: req.params.alias });
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    return res.status(200).json({ success: true, data: permission });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
permissionController.updatePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, alias, isActive } = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(
      id,
      { name, alias, isActive },
      { new: true }
    );
    if (!updatedPermission) {
      return res
        .status(404)
        .json({ success: false, message: 'Permission not found' });
    }
    res.status(200).json({ success: true, data: updatedPermission });
  } catch (error) {
    next(error);
  }
};

module.exports = permissionController;
