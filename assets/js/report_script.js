document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Obtener ID de la mascota de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idMascota = urlParams.get('id');

    if(!idMascota) {
        alert("Error: No se identificó la mascota.");
        window.history.back();
    }

    // 2. Manejar el envío
    const form = document.getElementById('reportForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const reporteData = {
            idMascota: idMascota,
            ubicacion: document.getElementById('ubicacion').value,
            comportamiento: document.getElementById('comportamiento').value,
            notas: document.getElementById('notas').value
        };

        if(!confirm("¿Estás seguro de generar la alerta de extravío?")) return;

        fetch("http://localhost:8080/api/reportes/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reporteData)
        })
        .then(res => {
            if(res.ok) return res.text();
            throw new Error("Error al crear reporte");
        })
        .then(msg => {
            alert("ALERTA ACTIVADA: La comunidad ha sido notificada.");
            // Redirigir al perfil para ver el cambio de estado (ahora debería salir ROJO)
            window.location.href = `/assets/pages/profile_pet.html?id=${idMascota}`;
        })
        .catch(err => {
            console.error(err);
            alert("Hubo un error al generar el reporte.");
        });
    });
});