document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/paises';  // URL base para los endpoints de áreas
    const paisesList = document.getElementById('paises-list');

    function loadPaises() {
        fetch(apiUrl, { method: 'GET' })  // Método GET explícito
            .then(response => response.json())
            .then(data => {
                paisesList.innerHTML = data.paises.map(pais => `
                    <tr>
                        <td>${pais.PAIS}</td>
                        <td>${pais.NOMBRE}</td>
                        <td>
                            <button onclick="editPais(${pais.PAIS})">Actualizar</button>
                            <button onclick="confirmDelete(${pais.PAIS})">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => {
                console.error('Error al cargar paises:', error);
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar los paises.';
            });
    }

    window.editPais = function (id) {
        window.location.href = `../upd_pais.html?id=${id}`; //es el numero del id
    };

    // Función para confirmar y eliminar un pais
    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar este pais?')) {
            deletePais(id, loadPaises); // Llama a deletePais con la función de recarga
        }
    };

    // Función para enviar la solicitud DELETE al servidor
    function deletePais(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, 
            { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // Recarga la lista si la eliminación fue exitosa
                } else {
                    alert('Error al eliminar el pais.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar pais:', error);
                alert('Error en la conexión con el servidor.');
            });
    }

    loadPaises();
});

