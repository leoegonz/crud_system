document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-marca-form');
    const marcaIdInput = document.getElementById('marca-id');
    const marcaNameInput = document.getElementById('marca-name');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const marcaId = urlParams.get('id');

    if (marcaId) {
        marcaIdInput.value = marcaId;

        fetch(`/marcas/marca/${marcaId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.marca) {
                    marcaNameInput.value = data.marca.NOMBRE;  // Cambia a 'NOMBRE' en mayúsculas
                } else {
                    errorMessage.textContent = 'No se encontró la marca.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener la marca.';
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = marcaNameInput.value.trim();

        fetch(`/marcas/update/${marcaId}`, {  // Método POST explícito
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_marcas.html';
            } else {
                errorMessage.textContent = 'Error al actualizar la marca.';
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
        });
    });
});