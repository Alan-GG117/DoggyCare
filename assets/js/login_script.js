document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginform');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 1. Capturar datos del formulario
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        const credenciales = {
            email: email,
            password: password
        };

        // 2. Enviar al Backend
        fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credenciales)
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Credenciales incorrectas");
        })
        .then(data => {
            // 3. Guardamos la sesión
            localStorage.setItem("user_session", JSON.stringify(data));
            
            alert("¡Bienvenido de nuevo, " + data.nombre + "!");
            
            // Redirigir al inicio
            window.location.href = '../../index.html';
        })
        .catch(err => {
            console.error(err);
            alert("Error: Correo o contraseña incorrectos.");
        });
    });
});