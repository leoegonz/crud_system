document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = '/categorias';  // URL base para los endpoints de categorias
    const categoriasList = document.getElementById('categorias-list');

    function loadCategorias() {
        fetch(apiUrl, { method: 'GET' })  // Método GET explícito
            .then(response => response.json())
            .then(data => {
                categoriasList.innerHTML = data.categorias.map(categoria => `
                    <tr>
                        <td>${categoria.CATEGORIA}</td>
                        <td>${categoria.NOMBRE}</td>
                        <td>
                            <button onclick="editCategoria(${categoria.CATEGORIA})">Actualizar</button>
                            <button onclick="confirmDelete(${categoria.CATEGORIA})">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            })
            .catch(error => {
                console.error('Error al cargar las categorias, una disculpa:', error);
                document.getElementById('error-message').style.display = 'block';
                document.getElementById('error-message').innerText = 'Error al cargar las categorias.';
            });
    }

    window.editCategoria = function (id) {
        window.location.href = `../upd_categoria.html?id=${id}`; //es el numero del id
    };

    // Función para confirmar y eliminar una categoria
    window.confirmDelete = function (id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta categoria?')) {
            deleteCategoria(id, loadCategorias); // Llama a deleteCategoria con la función de recarga
        }
    };

    // Función para enviar la solicitud DELETE al servidor
    function deleteCategoria(id, callback) {
        fetch(`${apiUrl}/delete/${id}`, 
            { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    callback(); // Recarga la lista si la eliminación fue exitosa
                } else {
                    alert('Error al eliminar la categoria, el dato se utiliza en otra tabla.');
                }
            })
            .catch(error => {
                console.error('Error al eliminar categoria:', error);
                alert('Error en la conexión con el servidor.');
            });
    }

    loadCategorias();
});

