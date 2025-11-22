
// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 30001;

// Configurar CORS
app.use(cors({
    origin: '*', // O puedes poner: 'http://127.0.0.1:5500' si quieres restringir
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// Habilitar JSON
app.use(express.json());


// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/biblioteca')
    .then(() => {
        console.log('📦 Conectado a MongoDB correctamente');
    })
    .catch((err) => {
        console.error('❌ Error al conectar a MongoDB:', err);
    });

// Definir esquema y modelo de usuario
const UsuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    cedula: String,
    password: String
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Ruta para registrar usuarios
app.post('/registro', async (req, res) => {
    try {
        const { nombre, email, cedula, password } = req.body;

        const nuevoUsuario = new Usuario({ nombre, email, cedula, password });
        await nuevoUsuario.save();

        console.log('✅ Usuario registrado:', nuevoUsuario);
        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});
// Ruta para login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseñas
        if (usuario.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Login exitoso
        res.status(200).json({ mensaje: 'Login exitoso', usuario: { nombre: usuario.nombre, email: usuario.email } });
    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error en login' });
    }
});



// Iniciar servidor
app.listen(30001, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${30001}`);
});






