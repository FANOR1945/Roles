const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Role', RoleSchema);
