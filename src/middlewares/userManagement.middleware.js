const User = require('../models/user/user.model');
const Role = require('../models/role/role.model');
const bcrypt = require('bcrypt');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../config/tokenGenerator');

const UserManagement = async (req, res, next) => {
  try {
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

    res.locals.user = userWithRole;
    next();
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

module.exports = UserManagement;
