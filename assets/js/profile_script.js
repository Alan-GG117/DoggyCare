document.addEventListener('DOMContentLoaded', function () {
    
    // 1. OBTENER ID DE LA URL
    const urlParams = new URLSearchParams(window.location.search);
    const mascotaId = urlParams.get('id');

    if (!mascotaId) {
        alert("Error: No se especificó ninguna mascota.");
        window.location.href = '/index.html';
        return;
    }

    // 2. REFERENCIAS DOM
    const container = document.getElementById('profileContent');
    const loading = document.getElementById('loading');
    const imgMascota = document.getElementById('imgMascota');
    const btnAction = document.getElementById('btnAction');
    const badge = document.getElementById('badgeStatus');

    // 3. FETCH AL BACKEND
    fetch(`http://localhost:8080/api/mascotas/${mascotaId}`)
        .then(res => {
            if (!res.ok) throw new Error("Mascota no encontrada");
            return res.json();
        })
        .then(mascota => {
            // --- LLENAR DATOS BÁSICOS ---
            document.getElementById('nombreMascota').innerText = mascota.nombre;
            document.getElementById('razaMascota').innerText = `${mascota.especie} - ${mascota.raza || 'Desconocida'}`;
            document.getElementById('sexoMascota').innerText = mascota.sexo;
            document.getElementById('tamanoMascota').innerText = mascota.tamano;
            document.getElementById('colorMascota').innerText = mascota.colorPelo;
            document.getElementById('esterilizadoMascota').innerText = mascota.esterilizado ? "Sí" : "No";
            document.getElementById('ruacMascota').innerText = mascota.ruac || "No registrado";
            document.getElementById('senasMascota').innerText = mascota.senasParticulares || "Sin señas particulares registradas.";

            // --- FOTO ---
            if (mascota.fotoUrl) {
                const filename = mascota.fotoUrl.split('\\').pop().split('/').pop();
                imgMascota.src = `http://localhost:8080/uploads/${filename}`;
            } else {
                imgMascota.src = '/assets/img/dog2.png';
            }

            // --- CHIP ---
            if (mascota.tieneChip) {
                document.getElementById('chipInfo').innerText = `SÍ - Tipo: ${mascota.tipoChip} (#${mascota.numeroChip})`;
            } else {
                document.getElementById('chipInfo').innerText = "No cuenta con microchip.";
            }

            // --- VACUNAS ---
            const tbody = document.getElementById('tablaVacunas');
            if (mascota.vacunas && mascota.vacunas.length > 0) {
                mascota.vacunas.forEach(v => {
                    const row = `<tr>
                        <td>${v.nombreVacuna}</td>
                        <td>${v.fechaAplicacion}</td>
                        <td>${v.duracionMeses} meses</td>
                    </tr>`;
                    tbody.innerHTML += row;
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="3">No hay vacunas registradas.</td></tr>';
            }

            // --- ESTADO (PERDIDA O NO) ---
            if (mascota.estaExtraviada) {
                // Caso: YA ESTÁ PERDIDA
                badge.innerText = "EXTRAVIADA";
                badge.className = "status-badge status-lost";
                btnAction.innerText = "¡LA ENCONTRÉ! (Cancelar reporte)";
                btnAction.style.backgroundColor = "#28a745"; // Verde para recuperar
                
                btnAction.onclick = () => {
                    // Aquí pondremos la lógica para cancelar reporte más adelante
                    alert("Funcionalidad de 'Recuperar' pendiente.");
                };
            } else {
                // Caso: ESTÁ EN CASA (Flujo Normal)
                badge.innerText = "EN CASA";
                badge.className = "status-badge status-safe";
                
                btnAction.onclick = () => {
                    // AQUÍ INICIA EL FLUJO DE REPORTE
                    // Redirigir al formulario de reporte con el ID
                    window.location.href = `/assets/pages/reportar_extravio.html?id=${mascotaId}`;
                };
            }

            // Mostrar contenido
            loading.style.display = 'none';
            container.style.display = 'flex';
        })
        .catch(err => {
            console.error(err);
            loading.innerText = "Error al cargar la información de la mascota.";
        });
});