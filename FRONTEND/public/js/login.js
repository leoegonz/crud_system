// Función para enviar datos de conexión al servidor
async function connectDatabase() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Enviar solicitud de conexión al backend
        const response = await fetch('/connect', { //aca conecta a la base de datos
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert("Conexión exitosa a la base de datos.");
        } else {
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('error-message').innerText = "Error en la conexión.";
        }
    } catch (error) {
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-message').innerText = "Error al conectar.";
    }
}

