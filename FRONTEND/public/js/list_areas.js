document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/areas';  // URL base para los endpoints de áreas
    const areasList = document.getElementById('areas-list');

    function loadAreas() {
        fetch(apiUrl, { method: 'GET' })  // Método GET explícito
            .then(response => response.json())
            .then(data => {
                areasList.innerHTML = data.map(area => `
                    <tr>
                        <td>${area.AREA}</td>
                        <td>${area.NOMBRE}</td>
                        <td>
                            <button onclick="editArea(${area.AREA})">Actualizar</button>
                            <button onclick="confirmDelete(${area.AREA})">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => {
                console.error('Error al cargar áreas:', error);
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las áreas.';
            });
    }

    window.editArea = function (id) {
        window.location.href = `../upd_area.html?id=${id}`; //es el numero del id
    };

    // Función para confirmar y eliminar un área
    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
            deleteArea(id, loadAreas); // Llama a deleteArea con la función de recarga
        }
    };

    // Función para enviar la solicitud DELETE al servidor
    function deleteArea(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, 
            { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // Recarga la lista si la eliminación fue exitosa
                } else {
                    alert('Error al eliminar el área.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar área:', error);
                alert('Error en la conexión con el servidor.');
            });
    }

    loadAreas();
});

