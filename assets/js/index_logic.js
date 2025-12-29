document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const nav = document.querySelector('nav');
    const logBtn = document.querySelector('.log-btn'); // Botón Iniciar sesión original
    const regBtn = document.querySelector('.reg-btn'); // Botón Registro original
    
    const heroSection = document.getElementById('heroSection');
    const heroTitle = document.getElementById('heroTitle');
    const heroText = document.getElementById('heroText');
    const heroBtn = document.getElementById('heroBtn');
    
    const petsDashboard = document.getElementById('petsDashboard');
    const petsGrid = document.getElementById('petsGrid');

    // 1. Verificar Sesión
    const session = JSON.parse(localStorage.getItem("user_session"));

    if (session && session.id) {
        // --- A. AJUSTE DE ENCABEZADO (LOGGEADO) ---
        
        // Ocultar botones de visitante
        if(logBtn) logBtn.style.display = 'none';
        if(regBtn) regBtn.style.display = 'none';
        
        // Mensaje de bienvenida
        const welcome = document.createElement('span');
        welcome.innerText = `Bienvenido, ${session.nombre}`;
        welcome.style.fontWeight = 'bold';
        welcome.style.color = '#2563eb';
        welcome.style.marginRight = '15px';

        // Botón Registrar Mascota
        const btnRegistrar = document.createElement('a');
        btnRegistrar.href = '/assets/pages/register_pet.html';
        btnRegistrar.className = 'reg-btn'; // Reusar estilo
        btnRegistrar.innerHTML = '<i class="fa-solid fa-paw"></i> Registrar Mascota';
        btnRegistrar.style.marginRight = '10px';

        // Botón Salir
        const btnSalir = document.createElement('a');
        btnSalir.href = '#';
        btnSalir.className = 'log-btn';
        btnSalir.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Salir';
        btnSalir.onclick = () => {
            localStorage.removeItem('user_session');
            window.location.reload();
        };

        // Insertar en el menú
        nav.appendChild(welcome);
        nav.appendChild(btnRegistrar);
        nav.appendChild(btnSalir);

        // --- B. CARGAR DATOS DE MASCOTAS ---
        fetch(`http://localhost:8080/api/mascotas/usuario/${session.id}`)
            .then(res => res.json())
            .then(mascotas => {
                
                if (mascotas.length === 0) {
                    // CASO 1: LOGGEADO PERO SIN MASCOTAS
                    heroTitle.innerText = "Da el primer paso registrando alguna de tus mascotas";
                    heroText.innerText = "Mantén segura la información de tus compañeros para actuar rápido en caso de emergencia.";
                    heroBtn.innerText = "Registrar Mascota Ahora";
                    heroBtn.href = "/assets/pages/register_pet.html";
                } else {
                    // CASO 2: LOGGEADO Y CON MASCOTAS (Mostrar Grid)
                    heroSection.style.display = 'none'; // Ocultar Hero
                    petsDashboard.style.display = 'block'; // Mostrar Dashboard

                    // Generar tarjetas
                    mascotas.forEach(mascota => {
                        const card = document.createElement('div');
                        card.className = 'pet-card';

                        // Procesar la URL de la imagen
                        // La base de datos guarda algo como "uploads/foto.jpg" o ruta absoluta
                        // Necesitamos limpiarla para que funcione con el servidor local
                        let imgUrl = '/assets/img/dog2.png'; // Imagen por defecto
                        if (mascota.fotoUrl) {
                            // Extraemos solo el nombre del archivo si viene con ruta completa
                            const filename = mascota.fotoUrl.split('\\').pop().split('/').pop(); 
                            imgUrl = `http://localhost:8080/uploads/${filename}`;
                        }

                        // Texto descriptivo (si está perdida o no)
                        const estadoTexto = mascota.estaExtraviada 
                            ? `<strong style="color:red;">¡ESTÁ PERDIDA!</strong>` 
                            : `Mascota segura en casa.`;

                        card.innerHTML = `
                            <img src="${imgUrl}" alt="${mascota.nombre}">
                            <div class="pet-card-body">
                                <h3>${mascota.nombre}</h3>
                                <span>${mascota.raza || mascota.especie}</span>
                                <p>
                                    ${estadoTexto} <br>
                                    <small>${mascota.senasParticulares || ''}</small>
                                </p>
                                <a href="/assets/pages/profile_pet.html?id=${mascota.idMascota}" class="btn-card">Ver Expediente</a>
                            </div>
                        `;
                        petsGrid.appendChild(card);
                    });
                }
            })
            .catch(err => console.error("Error cargando mascotas:", err));
            
    } else {
        // CASO 3: VISITANTE (NO LOGGEADO)
        // El HTML por defecto ya tiene los textos y botones correctos.
        // Solo aseguramos que el dashboard no se vea.
        petsDashboard.style.display = 'none';
    }
});