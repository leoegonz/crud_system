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

// Ruta para obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM EMPLEADOS ORDER BY NOMBRE');
        await connection.close();
        res.json({ success: true, empleados: result });
    } catch (err) {
        handleDbError(err, res, 'fetching empleados'); 
    }
});

// Nueva ruta GET para obtener los datos de un empleade específica por su ID
router.get('/empleado/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        const result = await connection.query(`SELECT * FROM EMPLEADOS WHERE EMPLEADO = ?`, [id]);
        await connection.close();

        if (result.length > 0) {
            res.json({ success: true, empleado: result[0] });
        } else {
            res.json({ success: false, error: 'Empleado no encontrado. Volver a ingresar' });
        }
    } catch (err) {

        handleDbError(err, res, 'fetching empleados by ID');  // *** MODIFICACIÓN ***
    }
});

// Ruta para agregar una nuevo empleado
router.post('/add', async (req, res) => {
    const { nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario } = req.body; // recibe nombre apellido direccion
    try {
      const connection = await getConnection();
      await connection.query(`INSERT INTO EMPLEADOS (NOMBRE, APELLIDO, DIRECCION, PAIS, TELEFONO, EMAIL, AREA, FECHA_INGRESO, FECHA_SALIDA, SALARIO ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario]); // Insertar todos los campos
      await connection.close();
      res.json({ success: true });
    } catch (err) {
      handleDbError(err, res, 'adding empleado');
    }
  });
  
  

// Ruta para actualizar un empleado existente
router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario } = req.body;
    try {
        const connection = await getConnection();
        await connection.query(`
            UPDATE EMPLEADOS 
            SET NOMBRE = ?, APELLIDO = ?, DIRECCION = ?, PAIS = ?, TELEFONO = ?, EMAIL = ?, AREA = ?, FECHA_INGRESO = ?, FECHA_SALIDA = ?, SALARIO = ?
            WHERE EMPLEADO = ?`, 
            [nombre, apellido, direccion, pais, telefono, email, area, fecha_ingreso, fecha_salida, salario, id]);        
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'updating empleado');  
    }
});

// Nueva ruta DELETE para eliminar un empleado
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await getConnection();
        await connection.query(`DELETE FROM EMPLEADOS WHERE EMPLEADO = ?`, [id]);
        await connection.close();
        res.json({ success: true });
    } catch (err) {
        handleDbError(err, res, 'eliminando empleado');  
    }
});

module.exports = router;