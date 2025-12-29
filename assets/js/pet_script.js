document.addEventListener('DOMContentLoaded', function () {
    
    //Verificacion de seguridad
    const session = JSON.parse(localStorage.getItem("user_session"));

    if(!session || !session.id) {
        alert("Debes iniciar seión para registrar una mascota");
        window.location.href = '../pages/login.html';
        return;
    }
    // --- 1. Base de datos local para selects ---
    const razasPerro = ["Mestizo", "Labrador", "Pastor Alemán", "Chihuahua", "Golden Retriever", "Pug", "Husky", "Otro"];
    const razasGato = ["Mestizo", "Persa", "Siamés", "Bengala", "Maine Coon", "Sphynx", "Otro"];

    // Referencias al DOM
    const selectEspecie = document.getElementById('especie');
    const selectRaza = document.getElementById('raza');
    const selectChip = document.getElementById('tieneChip');
    const divChip = document.getElementById('datosChip');
    const btnAddVacuna = document.getElementById('btnAgregarVacuna');
    const listaVacunas = document.getElementById('listaVacunas');
    const form = document.getElementById('petForm');

    // --- 2. Lógica de Raza Dinámica ---
    selectEspecie.addEventListener('change', function() {
        const especie = this.value;
        selectRaza.innerHTML = '<option value="">Selecciona Raza...</option>';
        selectRaza.disabled = false;

        let opciones = [];
        if (especie === 'Perro') opciones = razasPerro;
        else if (especie === 'Gato') opciones = razasGato;
        else selectRaza.disabled = true;

        opciones.forEach(raza => {
            const opt = document.createElement('option');
            opt.value = raza;
            opt.textContent = raza;
            selectRaza.appendChild(opt);
        });
    });

    // --- 3. Lógica de Chip (Mostrar/Ocultar) ---
    selectChip.addEventListener('change', function() {
        if (this.value === 'true') {
            divChip.classList.remove('hidden');
        } else {
            divChip.classList.add('hidden');
            // Limpiar valores si se oculta
            document.getElementById('tipoChip').value = '';
            document.getElementById('numChip').value = '';
        }
    });

    // --- 4. Lógica de Vacunas Dinámicas (Agregar/Borrar) ---
    btnAddVacuna.addEventListener('click', function() {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <input type="text" class="vac-nombre" placeholder="Ej: Rabia/Triple" style="width:90%; padding:5px;">
            </td>
            <td>
                <input type="date" class="vac-fecha" style="width:90%; padding:5px;">
            </td>
            <td>
                <select class="vac-duracion" style="width:90%; padding:5px;">
                    <option value="6">6 meses</option>
                    <option value="12" selected>1 año</option>
                    <option value="36">3 años</option>
                </select>
            </td>
            <td style="text-align:center;">
                <button type="button" class="btn-delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;

        // Añadir funcionalidad de borrar a la nueva fila
        row.querySelector('.btn-delete').addEventListener('click', function() {
            row.remove();
        });

        listaVacunas.appendChild(row);
    });

    // --- 5. Lógica de Submit (Recolección de Datos) ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Obtener la sesión del usuario (Necesitamos su ID)
        const session = JSON.parse(localStorage.getItem("user_session"));
        if (!session || !session.id) {
            alert("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
            window.location.href = '../login.html';
            return;
        }

        // 2. Recolectar vacunas
        const vacunasArray = [];
        document.querySelectorAll('#listaVacunas tr').forEach(fila => {
            const nombre = fila.querySelector('.vac-nombre').value;
            const fecha = fila.querySelector('.vac-fecha').value;
            const duracion = fila.querySelector('.vac-duracion').value;
            if(nombre) {
                vacunasArray.push({
                    nombre: nombre,
                    fechaAplicacion: fecha,
                    duracionMeses: duracion
                });
            }
        });

        // 3. Crear el objeto de datos (JSON)
        const mascotaData = {
            idDueño: session.id, // Usamos el ID real de la sesión
            nombre: document.getElementById('nombre').value,
            especie: document.getElementById('especie').value,
            raza: document.getElementById('raza').value,
            sexo: document.getElementById('sexo').value,
            tamano: document.getElementById('tamano').value,
            tipoPelo: document.getElementById('tipoPelo').value,
            color: document.getElementById('color').value,
            esterilizado: document.getElementById('esterilizado').value === 'true',
            senasParticulares: document.getElementById('senas').value,
            ruac: document.getElementById('ruac').value,
            chip: {
                tieneChip: selectChip.value === 'true',
                tipo: document.getElementById('tipoChip').value,
                numero: document.getElementById('numChip').value
            },
            historialVacunas: vacunasArray
        };

        // 4. PREPARAR EL ENVÍO HÍBRIDO (FormData)
        const formData = new FormData();
        // Adjuntamos el JSON como string bajo la clave "datos"
        formData.append("datos", JSON.stringify(mascotaData));
        // Adjuntamos el archivo real bajo la clave "file"
        formData.append("file", document.getElementById('fotoMascota').files[0]);

        console.log("Enviando mascota...");

        // 5. FETCH (Nota: No pongas Content-Type header manualmente con FormData, el navegador lo hace)
        fetch("http://localhost:8080/api/mascotas", {
            method: "POST",
            body: formData 
        })
        .then(response => {
            if (response.ok) return response.text();
            throw new Error("Error al subir mascota");
        })
        .then(msg => {
            alert("¡Mascota registrada correctamente!");
            window.location.href = "/index.html";
        })
        .catch(err => {
            console.error(err);
            alert("Error: " + err.message);
        });
    });
});