const User = require('../../models/user/user.model');
const Role = require('../../models/role/role.model');
const Permission = require('../../models/permission/permission.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {};
const secretKey = process.env.JWT_SECRET;

userController.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    const rolesArray = await Role.find({
      _id: { $in: role },
    });

    const permissionsArray = [];
    for (let role of rolesArray) {
      const permissionIds = await Permission.find({
        _id: { $in: role.permissionIds },
      });
      permissionsArray.push(...permissionIds);
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isActive: isActive || true,
      role: rolesArray.map((role) => role._id),
      permissionIds: permissionsArray.map((permission) => permission._id),
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: rolesArray.map((role) => {
          return {
            _id: role._id,
            name: role.name,
            permissionIds: role.permissionIds.map(
              (permission) => permission._id
            ),
          };
        }),
      },
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role').populate('permissionIds');

    const filteredUsers = users.filter((user) => user.isActive);

    res.status(200).json({
      message: 'Usuarios encontrados con éxito',
      users: filteredUsers.map((user) => {
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          role: user.role.map((role) => {
            return {
              _id: role._id,
              name: role.name,
              permissionIds: role.permissionIds,
            };
          }),
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role', 'name permissionIds')
      .populate('permissionIds', 'name');

    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.role.map((role) => {
        return {
          _id: role._id,
          name: role.name,
          permissionIds: role.permissionIds.map((permission) => permission._id),
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const rolesArray = await Role.find({
      _id: { $in: role },
    });

    const permissionsArray = [];
    for (let role of rolesArray) {
      const permissionIds = await Permission.find({
        _id: { $in: role.permissionIds },
      });
      permissionsArray.push(...permissionIds);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.isActive = isActive === undefined ? user.isActive : isActive;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 8);
      user.password = hashedPassword;
    }

    if (role) {
      user.role = rolesArray.map((role) => role._id);
      user.permissionIds = permissionsArray.map((permission) => permission._id);
    }

    await user.save();

    res.status(200).json({
      message: 'Usuario actualizado con éxito',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: rolesArray.map((role) => {
          return {
            _id: role._id,
            name: role.name,
            permissionIds: role.permissionIds.map(
              (permission) => permission._id
            ),
          };
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

userController.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no Encontrado' });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: 'Usuario desactivado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error desactivando usuario', error });
  }
};

userController.activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario activado exitosamente',
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al activar usuario', error });
  }
};
module.exports = userController;
