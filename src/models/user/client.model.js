const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  primer_nombre: {
    type: String,
  },
  segundo_nombre: {
    type: String,
  },
  tercer_nombre: {
    type: String,
  },
  apellido_paterno: {
    type: String,
    required: true,
  },
  apellido_materno: {
    type: String,
  },
  direccion: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },

  pais: {
    type: String,
    required: true,
  },
  ciudad: {
    type: String,
    required: true,
  },
  comunidad: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Role' }],
});

module.exports = mongoose.model('User', UserSchema);
