document.addEventListener('DOMContentLoaded', function () {
    const empleadosList = document.getElementById('empleados-list');

    function loadEmpleados() {
        fetch('/empleados', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                let empleados = data.empleados;
                if (data.success !== false) {
                    empleadosList.innerHTML = empleados.map(empleado => `
                        <tr>
                            <td>${empleado.EMPLEADO}</td>
                            <td>${empleado.NOMBRE}</td>
                            <td>${empleado.APELLIDO}</td>
                            <td>${empleado.DIRECCION}</td>
                            <td>${empleado.TELEFONO}</td>
                            <td>${empleado.EMAIL}</td>
                            <td>${empleado.AREA}</td>
                            <td>${empleado.FECHA_INGRESO}</td>
                            <td>${empleado.FEHCA_SALIDA}</td>
                            <td>${empleado.SALARIO}</td>
                            <td>
                                <button onclick="editEmpleado(${empleado.EMPLEADO})">Actualizar</button>
                                <button onclick="confirmDelete(${empleado.EMPLEADO})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('');
                } else {
                    alert(data.error || 'Error al cargar empleados.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al cargar empleados:', error);
            });
    }

    window.editEmpleado = function (id) {
        window.location.href = `upd_empleado.html?id=${id}`;
    };

    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            deleteEmpleado(id, loadEmpleados);
        }
    };

    function deleteEmpleado(id, callback) {
        fetch(`/empleados/delete/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback();
                } else {
                    alert(data.error || 'Error al eliminar el empleado.');
                }
            })
            .catch(error => {
                alert('Error en la conexión con el servidor.');
                console.error('Error al eliminar empleado:', error);
            });
    }

    loadEmpleados();
});