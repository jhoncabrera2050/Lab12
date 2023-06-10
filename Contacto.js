const mongoose = require('mongoose');

const archivoSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  correo: String,
  fecha_nac: String,
  urlImagen: String,
});

const Contacto = mongoose.model('Contacto', archivoSchema);

module.exports = Contacto;