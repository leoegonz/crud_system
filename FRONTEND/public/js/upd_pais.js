document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-pais-form');
    const paisIdInput = document.getElementById('pais-id');
    const paisNameInput = document.getElementById('pais-name');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const paisId = urlParams.get('id');

    if (paisId) {
        paisIdInput.value = paisId;

        fetch(`/paises/pais/${paisId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.pais) {
                    paisNameInput.value = data.pais.NOMBRE;  // Cambia a 'NOMBRE' en mayúsculas
                } else {
                    errorMessage.textContent = 'No se encontró el pais.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener el pais.';
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = paisNameInput.value.trim();

        fetch(`/paises/update/${paisId}`, {  // Método POST explícito
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_paises.html';
            } else {
                errorMessage.textContent = 'Error al actualizar el pais.';
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
        });
    });
});