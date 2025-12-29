document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addrform');
    const cpInput = document.getElementById('cp');
    const stateInput = document.getElementById('estado');
    const alcaInput = document.getElementById('alcaldia');
    const colSelect = document.getElementById('col');
    const loader = document.getElementById('loader');

    // Recuperar datos del Paso 1
    const userDataStep1 = JSON.parse(sessionStorage.getItem("user_data"));

    // Validación de seguridad
    if (!userDataStep1) {
        alert("No se encontraron datos de registro previo. Por favor inicia de nuevo.");
        window.location.href = 'register.html';
        return; // Detenemos la ejecución aquí
    }

    // --- Lógica de la API de Códigos Postales ---
    const limpiarCampos = () => {
        stateInput.value = '';
        alcaInput.value = '';
        colSelect.innerHTML = '<option value="">Selecciona una opción</option>';
        alcaInput.disabled = true;
        colSelect.disabled = true;
        stateInput.disabled = true;
    };

    cpInput.addEventListener('input', async function () {
        const codigoPostal = this.value;
        if (codigoPostal.length !== 5) {
            limpiarCampos();
            return;
        }

        loader.style.display = 'block';
        const token = "43a733dc-973e-43b9-884d-2f20034647ee"; 
        const apiUrl = `https://api.copomex.com/query/info_cp/${codigoPostal}?token=${token}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Error en red');
            const data = await response.json();

            if (data && !data.error) {
                const info = Array.isArray(data) ? data[0].response : data.response || data[0]; 
                
                stateInput.value = info.estado;
                alcaInput.value = info.municipio;
                
                colSelect.innerHTML = '';
                const asentamientos = Array.isArray(info.asentamiento) ? info.asentamiento : [info.asentamiento];
                
                asentamientos.forEach(colonia => {
                    const option = document.createElement('option');
                    option.value = colonia;
                    option.textContent = colonia;
                    colSelect.appendChild(option);
                });

                alcaInput.disabled = false;
                colSelect.disabled = false;
                stateInput.disabled = false;
            } else {
                limpiarCampos();
                colSelect.innerHTML = '<option value="">CP no encontrado</option>';
            }
        } catch (error) {
            console.error('Error:', error);
            limpiarCampos();
        } finally {
            loader.style.display = 'none';
        }
    });

    // --- Lógica de Envío Final (CORREGIDA) ---
    form.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const numInterior = document.getElementById('int').value;

        // Construcción del OBJETO MAESTRO
        const registroCompleto = {
            usuario: {
                nombre: userDataStep1.name,
                apPaterno: userDataStep1.pat,
                apMaterno: userDataStep1.mat,
                email: userDataStep1.email,
                telefono: userDataStep1.phone,
                password: userDataStep1.pass // Recuerda: idealmente esto viaja por HTTPS
            },
            direccion: {
                cp: cpInput.value,
                estado: stateInput.value,
                alcaldia: alcaInput.value,
                colonia: colSelect.value,
                tipoCalle: document.getElementById('streetType').value,
                calle: document.getElementById('street').value,
                numExterior: document.getElementById('ext').value,
                numInterior: numInterior ? numInterior : "S/N"
            }
        };

        console.log("Enviando al backend:", registroCompleto);

        // Fetch único para mandar la información
        fetch("http://localhost:8080/api/auth/registro-completo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registroCompleto)
        })
        .then(response => {
            // Verificamos si la respuesta es OK (status 200-299)
            if (response.ok) {
                return response.json();
            } else {
                // Si el servidor responde con error (ej. "Email ya existe"), lanzamos error para que caiga en el catch
                return response.text().then(text => { throw new Error(text) });
            }
        })
        .then(data => {
            // --- ÉXITO: Solo entramos aquí si el servidor guardó todo bien ---
            alert("¡Registro exitoso! Bienvenido " + data.nombre);
            
            // Guardamos la sesión activa
            localStorage.setItem("user_session", JSON.stringify(data));
            
            // Limpiamos los datos temporales del registro AHORA SÍ
            sessionStorage.removeItem("user_data");
            
            // Redirigimos al inicio
            window.location.href = '/index.html'; 
        })
        .catch(err => {
            // --- ERROR: Si algo falla, avisamos al usuario y NO redirigimos ---
            console.error(err);
            alert("Error al registrar: " + err.message);
        });
        
        // NOTA: He eliminado el redireccionamiento que estaba aquí abajo.
        // Nunca pongas un window.location fuera del fetch si dependes de la respuesta.
    });
});