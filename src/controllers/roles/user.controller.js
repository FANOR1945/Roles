const User = require('../../models/roles/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {};
const secretKey = process.env.JWT_SECRET;
userController.registerUser = async (req, res, next) => {
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
    const users = await User.find({}, '-password');
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId, '-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no Encontrado' });
    }

    res.status(200).json({ user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, password: hashedPassword, role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no Encontrado' });
    }

    res
      .status(200)
      .json({ message: 'Usuario actualizado con exito', user: user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

userController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    res
      .status(200)
      .json({ message: 'User successfully deleted', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
module.exports = userController;
