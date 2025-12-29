document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('bulletinGrid');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('noData');

    fetch("http://localhost:8080/api/mascotas/publicas/extraviadas")
        .then(res => res.json())
        .then(mascotas => {
            loading.style.display = 'none';

            if (mascotas.length === 0) {
                noData.style.display = 'block';
                return;
            }

            mascotas.forEach(mascota => {
                const card = document.createElement('div');
                card.className = 'pet-card lost-mode'; // Clase especial para borde rojo

                // Procesar imagen
                let imgUrl = '/assets/img/dog2.png';
                if (mascota.fotoUrl) {
                    const filename = mascota.fotoUrl.split('\\').pop().split('/').pop();
                    imgUrl = `http://localhost:8080/uploads/${filename}`;
                }

                card.innerHTML = `
                    <img src="${imgUrl}" alt="${mascota.nombre}">
                    <div class="pet-card-body">
                        <h3 style="color: #dc3545;">${mascota.nombre}</h3>
                        <span>${mascota.raza} (${mascota.especie})</span>
                        
                        <p style="font-size: 0.9rem; color: #555;">
                            <strong>Señas:</strong> ${mascota.senasParticulares || 'Sin datos'}<br>
                            <strong>Tamaño:</strong> ${mascota.tamano}
                        </p>
                        
                        <a href="/assets/pages/reportar_hallazgo.html?idExtraviada=${mascota.idMascota}" class="btn-found">
                            <i class="fa-solid fa-eye"></i> ¡La vi / La encontré!
                        </a>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
            loading.innerText = "Error al cargar el boletín.";
        });
});