const User = require('../../models/user/user.model');
const Role = require('../../models/role/role.model');
const Permission = require('../../models/permission/permission.model');
const bcrypt = require('bcrypt');
const {
  userValidationMiddleware,
} = require('../../middlewares/validation.middleware');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../../config/tokenGenerator');
const userController = {};

userController.createUser = async (req, res) => {
  try {
    await userValidationMiddleware(req, res, async () => {
      const { name, email, password, isActive, role } = req.body;

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const roleObject = await Role.findById(role);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isActive,
        role: [roleObject],
      });

      const userWithRole = await User.findById(user._id)
        .populate({
          path: 'role',
          populate: {
            path: 'permissions',
            select: '_id alias',
          },
        })
        .select('-password');

      const accessToken = generateAccessToken({
        userId: user._id,
        role: user.role,
      });

      const refreshToken = generateRefreshToken({
        userId: user._id,
        role: user.role,
      });

      res.setHeader('X-Access-Token', accessToken);
      res.setHeader('Authorization', refreshToken);

      return res.status(201).json({
        message: 'Usuario creado con éxito',
        user: userWithRole,
      });
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'El correo electrónico ya está registrado' });
    }
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate({
        path: 'role',
        populate: {
          path: 'permissions',
          select: '_id alias',
        },
      })
      .select('-password');

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
              permissions: role.permissions.map((permission) => ({
                _id: permission._id,
                alias: permission.alias,
              })),
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
    const user = await User.findById(req.params.id).populate({
      path: 'role',
      select: 'name permissions',
      populate: {
        path: 'permissions',
        select: 'name',
      },
    });

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
          permissions: role.permissions.map((permission) => permission.name),
        };
      }),
    });
  } catch (error) {
    next(error);
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    await userValidationMiddleware(req, res, async () => {
      const { name, email, password, role, isActive } = req.body;
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      let rolesArray, permissionsArray;

      if (role) {
        rolesArray = await Role.find({
          _id: { $in: role },
        });

        if (!rolesArray.length) {
          return res.status(404).json({ message: 'Roles no encontrados' });
        }

        permissionsArray = await Permission.find({
          role: { $in: role },
        });
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
        user.permissionIds = permissionsArray.map(
          (permission) => permission._id
        );
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
              permissionIds: role.permissions.map(
                (permission) => permission._id
              ),
            };
          }),
        },
      });
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
