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
const handleDbError = (err, res, action) => {
    const errorMessage = err?.odbcErrors?.[0]?.message || err.message || 'Unknown database error';
    console.error(`Error al ${action}:`, errorMessage);
    res.status(500).json({ success: false, error: `Database error while ${action}: ${errorMessage}` });
};

// Ruta para obtener todas las categorias
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM CATEGORIAS ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, categorias: result });
    } catch (err) {
        handleDbError(err, res, 'fetching categorias');  
    }
});

// Nueva ruta GET para obtener los datos de una categoria específica por su ID
router.get('/categoria/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM CATEGORIAS WHERE CATEGORIA = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, categoria: result[0] });
        } else {
            res.json({ success: false, error: 'Categoria no encontrada. Volver a ingresar' });
        }
    } catch (err) {
        handleDbError(err, res, 'fetching categoria by ID');  
    }
});

// Ruta para agregar una nueva categoria
router.post('/add', async (req, res) => {
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`INSERT INTO CATEGORIAS (NOMBRE) VALUES (?)`, [nombre]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'adding categoria');  
    }
});

// Ruta para actualizar una categoria existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`UPDATE CATEGORIAS SET NOMBRE = ? WHERE CATEGORIA = ?`, [nombre, id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating categoria');  
    }
});

// Nueva ruta DELETE para eliminar una categoria
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM CATEGORIAS WHERE CATEGORIA = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'deleting categoria');  
    }
});

module.exports = router;