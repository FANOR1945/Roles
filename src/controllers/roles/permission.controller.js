const Permission = require('./permission.model');

exports.createPermission = async (req, res, next) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

exports.getPermission = async (req, res, next) => {
  try {
    const permission = await Permission.findById(req.params.id);
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

exports.updatePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
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
