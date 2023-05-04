const User = require('../../models/user/user.model');
const Role = require('../../models/role/role.model');
const Permission = require('../../models/permission/permission.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userController = {};
const secretKey = process.env.JWT_SECRET;

userController.createUser = async (req, res) => {
  try {
    const { name, email, password, isActive, role } = req.body;

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Obtener el rol que se está asignando al usuario
    const selectedRole = await Role.findById(role).populate('permissions');

    // Crear usuario con rol correspondiente y agregar los permisos del rol
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isActive,
      role: [selectedRole._id], // Agregar el ID del rol al que pertenece el usuario
    });

    user.role[0].permissions = selectedRole.permissions.map(
      (permission) => permission._id
    ); // Agregar los permisos del rol al usuario

    await user.save(); // Guardar el usuario con los permisos

    // Mostrar el usuario con su rol y permisos correspondientes
    const userWithRole = await User.findById(user._id)
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          select: '_id alias',
        },
      })
      .select('-password');

    // Generar token JWT con el id del usuario
    const token = jwt.sign({ userId: user._id }, secretKey);

    return res
      .status(201)
      .json({ message: 'Usuario creado con éxito', user: userWithRole, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('role').populate({
      path: 'permissions',
      select: 'name',
    });

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
              permissions: role.permissionIds,
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
          permissions: role.permissionIds.map((permission) => permission._id),
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
