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
        throw err;
    }
};

// Ruta para obtener todas las áreas
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM AREAS ORDER BY NOMBRE');
        await connection.close();
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error al obtener áreas.' });
    }
});

// Nueva ruta GET para obtener los datos de un área específica por su ID
router.get('/area/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM AREAS WHERE AREA = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, area: result[0] });
        } else {
            res.json({ success: false, error: 'Área no encontrada.' });
        }
    } catch (err) {
        console.error('Error al obtener el área:', err);
        res.status(500).json({ success: false, error: 'Error al obtener el área.' });
    }
});

// Ruta para agregar una nueva área
router.post('/add', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`INSERT INTO AREAS (NOMBRE) VALUES (?)`, [nombre]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error al agregar el área.' });
    }
});

// Ruta para actualizar un área existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`UPDATE AREAS SET NOMBRE = ? WHERE AREA = ?`, [nombre, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error al actualizar el área.' });
    }
});

// Nueva ruta DELETE para eliminar un área
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM AREAS WHERE AREA = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Error al eliminar el área.' });
    }
});

module.exports = router;