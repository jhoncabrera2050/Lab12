const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://jhon:90C7ZXFPChr8E8LM@atlascluster.hhkpyq7.mongodb.net/?retryWrites=true&w=majority';

const conectarDB = async () => {
  try {
    await mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

module.exports = conectarDB;