const User = require('../../models/user/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {};
const secretKey = process.env.JWT_SECRET;

userController.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: user,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }, '-password');
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id, '-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no Encontrado' });
    }

    if (!user.isActive) {
      return res.status(404).json({ message: 'Usuario no activo' });
    }

    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuario no Encontrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.password = hashedPassword;
    userToUpdate.role = role;

    await userToUpdate.save();

    res
      .status(200)
      .json({ message: 'Usuario actualizado con exito', user: userToUpdate });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
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

    res
      .status(200)
      .json({ message: 'Usuario desactivado con exito', user: user });
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
