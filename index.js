const express = require('express');
const multer = require('multer');
const cloudinary = require('./cloudinaryConfig');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.set('views','./public')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Contacto = require('./Contacto');
const conectarDB = require('./configdb');
conectarDB();

const upload = multer({ dest: 'uploads/' });


app.post('/guardar',  upload.single('foto'), async (req, res) => {
    
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const fecha_nac = req.body.fecha_nac;
    const foto = req.file;
  
    // Carga la imagen a Cloudinary
    const resultadoCloudinary = await cloudinary.uploader.upload(foto.path);
  
    const nuevoArchivo = new Contacto({
      nombre: nombre,
      apellidos: apellidos,
      correo: correo,
      fecha_nac:fecha_nac,
      urlImagen: resultadoCloudinary.secure_url 
    });

    await nuevoArchivo.save();
    res.redirect('/');
  });

  app.post('/filtro', async (req, res) => {
    try {
      const nombre = req.body.nombre; // Obtener el valor del input desde la consulta GET
  
      let objetos;
      if (nombre) {
        objetos = await Contacto.find({ nombre: nombre });
      } else {
        objetos = await Contacto.find();
      }
  
      res.render('nombre', { resultados: objetos });
    } catch (error) {
      console.error('Error al obtener los objetos de la base de datos:', error);
      res.status(500).send('Error al obtener los objetos');
    }
  });
  
  

  app.get('/', async (req, res) => {
    try {
      const objetos = await Contacto.find();
  
      res.render('index',{resultados:objetos});
    } catch (error) {
      console.error('Error al obtener los objetos de la base de datos:', error);
      res.status(500).send('Error al obtener los objetos');
    }
  });

app.get('/editar/:id', async (req, res) => {
    try {
      const archivo = await Contacto.findById(req.params.id);
      if (!archivo) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      res.render('edit',{contacto:archivo})
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el archivo' });
    }
  });
  
// app.post('/editar/:id',upload.single('foto'),async (req, res) => {
//   const foto = req.file;
//   const resultadoCloudinary = await cloudinary.uploader.upload(foto.path);
//   const update = {
//       nombre: req.body.nombre,
//       apellidos: req.body.apellidos,
//       correo: req.body.correo,
//       fecha_nac:req.body.fecha_nac,
//       urlImagen: resultadoCloudinary.secure_url
//   }
//     try {
//       const archivo = await Contacto.findByIdAndUpdate(req.params.id, update, { new: true });
//       if (!archivo) {
//         return res.status(404).json({ error: 'Archivo no encontrado' });
//       }
//       res.redirect('/');
//     } catch (error) {
//       res.status(500).json({ error: 'Error al actualizar el archivo' });
//     }
  
// });



app.post('/editar/:id',upload.single('foto'),async (req, res) => {
  try {
    const contactoActual = await Contacto.findById(req.params.id);
    if (!contactoActual) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    let update = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      correo: req.body.correo,
      fecha_nac: req.body.fecha_nac,
      urlImagen: contactoActual.urlImagen, // Obtener la URL de la imagen actual
    };

    if (req.file) {
      const foto = req.file;
      const resultadoCloudinary = await cloudinary.uploader.upload(foto.path);
      update.urlImagen = resultadoCloudinary.secure_url;
    }

    const archivo = await Contacto.findByIdAndUpdate(req.params.id, update, { new: true });
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el archivo' });
  }
  
});


app.get('/eliminar/:id', async (req, res) => {
    try {
      const archivo = await Contacto.findByIdAndDelete(req.params.id);
      if (!archivo) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      res.redirect('/');
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el contacto' });
    }
  });

app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000');
});







