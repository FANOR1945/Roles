const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeSchema = new Schema({
  tarifa_hora_diaria: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  horas_diarias_dedicadas: {
    type: Number,
    required: true,
  },
  total_diarias_dedicadas: {
    type: Number,
    required: true,
  },
  gasto_alquiler: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  gasto_transporte: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  gasto_telefono_internet: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  gasto_alimentacion: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  gasto_adicional_otros: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  total_gastos_fijos: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  costo_adicional_servicio: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  tarifa_total_servicio: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  fechaInicio: {
    type: Date,
    required: true,
  },
  fechaFin: {
    type: Date,
  },
});

module.exports = mongoose.model('Fee', FeeSchema);
