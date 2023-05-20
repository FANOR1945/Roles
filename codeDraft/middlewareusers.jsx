/*const User = require('./models/user');

const UserManagement = {
  // Middleware para crear un usuario
  createUser: async (userData) => {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const users = await User.find().populate('role');
      return users;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para obtener un usuario por ID
  getUser: async (userId) => {
    try {
      const user = await User.findById(userId).populate('role');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para buscar usuarios por nombre
  searchUser: async (nombre) => {
    try {
      const users = await User.find({ nombre: nombre }).populate('role');
      return users;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para buscar usuarios por nombres**********************importantee
  searchUsers: async (nombres) => {
    try {
      const users = await User.find({ nombre: { $in: nombres } }).populate(
        'role'
      );
      return users;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para actualizar un usuario
  updateUser: async (userId, userData) => {
    try {
      const user = await User.findByIdAndUpdate(userId, userData, {
        new: true,
      }).populate('role');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para desactivar un usuario
  deactivateUser: async (userId) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      ).populate('role');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },

  // Middleware para activar un usuario
  activateUser: async (userId) => {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: true },
        { new: true }
      ).populate('role');
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = UserManagement;
*/
