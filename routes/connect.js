// connect.js - Microservicio para conexión a la base de datos

const express = require('express');
const odbc = require('odbc');
const router = express.Router();

// Variables globales para almacenar las credenciales
global.dbUser = '';
global.dbPassword = '';

// Ruta POST para conectar a la base de datos
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Intentar la conexión usando ODBC
        global.dbUser = username;
        global.dbPassword = password;
        
        const connection = await odbc.connect(`DSN=prog4;UID=${username};PWD=${password}`);
        res.status(200).send("Conexión exitosa");
    } catch (error) {
        res.status(500).send("Error de conexión");
    }
});

module.exports = router;