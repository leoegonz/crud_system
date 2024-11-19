//Es el archivo principal del servidor. Configura el servidor con Express y define rutas
//para servir el archivo HTML ('login.html') y para el microservicio de conexión. Cuando el
//cliente solicita la página de inicio, la ruta GET '/' responde enviando 'login.html'. Para la
//conexión a la base de datos, el servidor redirige las solicitudes POST a '/connect' y utiliza el
//microservicio definido en 'connect.js'.

// app.js - Configuración inicial del servidor

const express = require('express');
const path = require('path');

// Importa los microservicios
const connectRoute = require('./routes/connect'); // Ruta del microservicio
const areasRouter = require('./routes/areas'); // Ruta para áreas
const empleadosRouter = require('./routes/empleados');  // Ruta para empleados
const paisesRouter = require('./routes/paises');  // Ruta para países

const app = express();
const PORT = 3000;

// Middleware para analizar datos en formato JSON
app.use(express.json());

// Sirve archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas de frontend
// Ruta principal para mostrar la página de conexión (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login.html'));
});

//para areas
app.get('/list_areas', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_areas.html'));
});

app.get('/add_area', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_area.html'));
});

app.get('/upd_area', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_area.html'));
});

//para empleados
app.get('/list_empleados', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_empleados.html'));
});

app.get('/add_empleado', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_empleado.html'));
});

app.get('/upd_empleado', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_empleado.html'));
});

//para paises
app.get('/list_paises', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/list_paises.html'));
});

app.get('/add_pais', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/add_pais.html'));
});

app.get('/upd_pais', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/upd_pais.html'));
});


//Rutas de microservicios - Usar el microservicio de conexión
app.use('/connect', connectRoute);
app.use('/areas', areasRouter); //ruta para areas
app.use('/empleados', empleadosRouter); //Ruta para empleados
app.use('/paises', paisesRouter); // Ruta para países

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});