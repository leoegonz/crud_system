document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-empleado-form');
    const urlParams = new URLSearchParams(window.location.search);
    const empleadoId = urlParams.get('id');

    // Método para cargar la lista de países
    const loadCountries = () => {
        fetch('/paises/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const paisSelect = document.getElementById('pais');
                    data.paises.forEach(pais => {
                        const option = document.createElement('option');
                        option.value = pais.PAIS;
                        option.textContent = pais.NOMBRE;
                        paisSelect.appendChild(option);
                    });
                } else {
                    alert(data.error || 'Error al cargar la lista de países.');
                }
            })
            .catch(error => console.error('Error al cargar países:', error));
    };

    // Método para cargar la lista de áreas
    const loadAreas = () => {
        fetch('/areas/')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    const areaSelect = document.getElementById('area');
                    data.areas.forEach(area => {
                        const option = document.createElement('option');
                        option.value = area.AREA;
                        option.textContent = area.NOMBRE;
                        areaSelect.appendChild(option);
                    });
                } else {
                    alert(data.error || 'Error al cargar la lista de áreas.');
                }
            })
            .catch(error => console.error('Error al cargar áreas:', error));
    };

    // Cargar listas al inicio
    loadCountries();
    loadAreas();

    // Cargar datos del empleado actual
    if (empleadoId) {
        fetch(`/empleados/empleado/${empleadoId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.empleado) {
                    document.getElementById('nombre').value = data.empleado.NOMBRE;
                    document.getElementById('apellido').value = data.empleado.APELLIDO;
                    document.getElementById('direccion').value = data.empleado.DIRECCION;
                    document.getElementById('pais').value = data.empleado.PAIS;
                    document.getElementById('telefono').value = data.empleado.TELEFONO;
                    document.getElementById('email').value = data.empleado.EMAIL;
                    document.getElementById('area').value = data.empleado.AREA;
                    document.getElementById('fecha_ingreso').value = data.empleado.FECHA_INGRESO;
                    document.getElementById('fecha_salida').value = data.empleado.FECHA_SALIDA;
                    document.getElementById('salario').value = data.empleado.SALARIO;
                } else {
                    alert(data.error || 'Empleado no encontrado.');
                }
            })
            .catch(error => {
                alert('Error al obtener datos del empleado.');
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const updatedEmpleadoData = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            pais: document.getElementById('pais').value,
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            area: document.getElementById('area').value,
            fecha_ingreso: document.getElementById('fecha_ingreso').value,
            fecha_salida: document.getElementById('fecha_salida').value || null,
            salario: document.getElementById('salario').value
        };

        fetch(`/empleados/update/${empleadoId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEmpleadoData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_empleados.html';
            } else {
                alert(data.error || 'Error al actualizar el empleado.');
            }
        })
        .catch(error => {
            alert('Error en la conexión con el servidor.');
            console.error('Error al actualizar empleado:', error);
        });
    });
});