const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  role: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  }],
  permissionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true,
  }],
});

module.exports = mongoose.model('User', UserSchema);
