document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-area-form');
    const areaIdInput = document.getElementById('area-id');
    const areaNameInput = document.getElementById('area-name');
    const errorMessage = document.getElementById('error-message');

    const urlParams = new URLSearchParams(window.location.search);
    const areaId = urlParams.get('id');

    if (areaId) {
        areaIdInput.value = areaId;

        fetch(`/areas/area/${areaId}`, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.area) {
                    areaNameInput.value = data.area.NOMBRE;  // Cambia a 'NOMBRE' en mayúsculas
                } else {
                    errorMessage.textContent = 'No se encontró el área.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error al obtener el área.';
                console.error('Error:', error);
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newName = areaNameInput.value.trim();

        fetch(`/areas/update/${areaId}`, {  // Método POST explícito
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/list_areas.html';
            } else {
                errorMessage.textContent = 'Error al actualizar el área.';
            }
        })
        .catch(error => {
            errorMessage.textContent = 'Error en la conexión con el servidor.';
        });
    });
});