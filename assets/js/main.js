document.addEventListener('DOMContentLoaded', function () {
    // Verificar si existe sesión guardada
    const session = JSON.parse(localStorage.getItem("user_session"));

    // Buscar los botones del menú (asegúrate de que tus etiquetas <a> tengan estas clases o IDs)
    const btnLogin = document.querySelector('.log-btn');
    const btnRegister = document.querySelector('.reg-btn');
    const navContainer = document.querySelector('nav');

    if (session && session.nombre) {
        // --- USUARIO LOGUEADO ---

        // 1. Ocultar botones de registro/login
        if (btnLogin) btnLogin.style.display = 'none';
        if (btnRegister) btnRegister.style.display = 'none';

        // 2. Crear mensaje de bienvenida
        const welcomeMsg = document.createElement('span');
        welcomeMsg.innerHTML = `<i class="fa-solid fa-user"></i> Hola, <b>${session.nombre}</b>`;
        welcomeMsg.style.color = '#2563eb'; // Tu color primario
        welcomeMsg.style.fontWeight = 'bold';
        welcomeMsg.style.marginRight = '15px';

        // 3. Crear botón de Cerrar Sesión
        const logoutBtn = document.createElement('a');
        logoutBtn.href = "#";
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Salir';
        logoutBtn.className = 'log-btn'; // Reusamos tu estilo
        logoutBtn.onclick = function () {
            localStorage.removeItem("user_session");
            window.location.reload(); // Recargar página para resetear vista
        };

        // Insertar en el menú
        navContainer.appendChild(welcomeMsg);
        navContainer.appendChild(logoutBtn);
    }
});