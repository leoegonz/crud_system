document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/marcas';  // URL base para los endpoints de marca
    const marcasList = document.getElementById('marcas-list');

    function loadMarcas() {
        fetch(apiUrl, { method: 'GET' })  // Método GET explícito
            .then(response => response.json())
            .then(data => {
                marcasList.innerHTML = data.marcas.map(marca => `
                    <tr>
                        <td>${marca.MARCA}</td>
                        <td>${marca.NOMBRE}</td>
                        <td>
                            <button onclick="editMarca(${marca.MARCA})">Actualizar</button>
                            <button onclick="confirmDelete(${marca.MARCA})">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => {
                console.error('Error al cargar las marcas, una disculpa:', error);
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las marcas.';
            });
    }

    window.editMarca = function (id) {
        window.location.href = `../upd_marca.html?id=${id}`; //es el numero del id
    };

    // Función para confirmar y eliminar una marca
    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
            deleteMarca(id, loadMarcas); // Llama a deleteMarca con la función de recarga
        }
    };

    // Función para enviar la solicitud DELETE al servidor
    function deleteMarca(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, 
            { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // Recarga la lista si la eliminación fue exitosa
                } else {
                    alert('Error al eliminar la marca, el dato se utiliza en otra tabla.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar marca:', error);
                alert('Error en la conexión con el servidor.');
            });
    }

    loadMarcas();
});

