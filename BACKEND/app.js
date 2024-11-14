//Es el archivo principal del servidor. Configura el servidor con Express y define rutas
//para servir el archivo HTML ('login.html') y para el microservicio de conexión. Cuando el
//cliente solicita la página de inicio, la ruta GET '/' responde enviando 'login.html'. Para la
//conexión a la base de datos, el servidor redirige las solicitudes POST a '/connect' y utiliza el
//microservicio definido en 'connect.js'.

// app.js - Configuración inicial del servidor

const express = require('express');
const path = require('path');
const connectRoute = require('./routes/connect'); // Ruta del microservicio

const app = express();
const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Ruta principal para mostrar la página de conexión (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

// Usar el microservicio de conexión
app.use('/connect', connectRoute);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});