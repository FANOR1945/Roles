const mongoose = require('mongoose');
const Role = require('../role/role.model');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
  //role: { type: String },//for create firts user
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
});

module.exports = mongoose.model('User', UserSchema);
