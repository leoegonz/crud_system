const express = require('express');
const router = express.Router();
const odbc = require('odbc');

// Función para obtener la conexión a la base de datos
const getConnection = async () => {
    try {
        const connection = await odbc.connect(`DSN=prog4;UID=${global.dbUser};PWD=${global.dbPassword}`);
        return connection;
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        throw new Error('Error de conexion de Base de Datos');
    }
};

// Función para manejo de errores de base de datos
// *** MODIFICACIÓN ***
const handleDbError = (err, res, action) => {
    const errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Database error while ${action}: ${errorMessage}` });
};

// Ruta para obtener todas las áreas
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM PAISES ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, paises: result });
    } catch (err) {
        //res.status(500).json({ success: false, error: 'Error al obtener áreas.' });
        handleDbError(err, res, 'fetching paises');  // *** MODIFICACIÓN ***
    }
});

// Nueva ruta GET para obtener los datos de un área específica por su ID
router.get('/pais/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM PAISES WHERE PAIS = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, pais: result[0] });
        } else {
            res.json({ success: false, error: 'Pais no encontrada. Volver a ingresar' });
        }
    } catch (err) {
        //console.error('Error al obtener el área:', err);
        //res.status(500).json({ success: false, error: 'Error al obtener el área.' });
        handleDbError(err, res, 'fetching pais by ID');  // *** MODIFICACIÓN ***
    }
});

// Ruta para agregar una nueva área
router.post('/add', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`INSERT INTO PAISES (NOMBRE) VALUES (?)`, [nombre]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        //res.status(500).json({ success: false, error: 'Error al agregar el área.' });
        handleDbError(err, res, 'adding pais');  // *** MODIFICACIÓN ***
    }
});

// Ruta para actualizar un área existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`UPDATE PAISES SET NOMBRE = ? WHERE PAIS = ?`, [nombre, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating pais');  // *** MODIFICACIÓN ***//res.status(500).json({ success: false, error: 'Error al actualizar el área.' });
    }
});

// Nueva ruta DELETE para eliminar un área
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM PAISES WHERE PAIS = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'deleting pais');  // *** MODIFICACIÓN ***//res.status(500).json({ success: false, error: 'Error al eliminar el área.' });
    }
});

module.exports = router;