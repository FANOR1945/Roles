const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceAtentionSchema = new Schema({
  name_service: {
    type: String,
    required: true,
    unique: true,
  },
  client_date: {
    nombre: String,
    apellido: String,
    origen: String,
    required: true,
    unique: true,
  },
  fee: {
    type: Schema.Types.ObjectId,
    ref: 'Fee',
  },
});

module.exports = mongoose.model('ServiceAtention', ServiceAtentionSchema);
