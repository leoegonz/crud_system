document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-area-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();

        fetch('/areas/add', {  // Directamente al endpoint para agregar el área
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_areas.html';
            } else {
                errorMessage.textContent = 'Error al agregar el área, vuelva a intentar.';
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
        });
    });
});