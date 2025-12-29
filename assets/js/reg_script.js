//Cargar el contenido html
document.addEventListener('DOMContentLoaded', function () {

    //Seleccionar formulario por ID
    const form = document.getElementById('registerform');

    // Función para validar contraseña
    function validarPassword(password) {
        const errores = [];

        if (password.length < 10) {
            errores.push("La contraseña debe tener al menos 10 caracteres");
        }
        if (!/[A-Z]/.test(password)) {
            errores.push("Debe contener al menos una letra mayúscula");
        }
        if (!/[0-9]/.test(password)) {
            errores.push("Debe contener al menos un número");
        }
        if (!/[_#]/.test(password)) {
            errores.push("Debe contener al menos un símbolo '_' o '#'");
        }

        return errores;
    }

    //Evento que se dispara al enviar el formulario
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        console.log("¡El evento submit fue detectado!"); 

        //Acceder al valor de los campos
        const name = document.getElementById('name').value;
        const pat = document.getElementById('ln1').value;
        const mat = document.getElementById('ln2').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const pass1 = document.getElementById('pass').value;
        const pass2 = document.getElementById('confirm-pass').value;

        // Validar contraseñas
        const errores = validarPassword(pass1);

        // Comprobar confirmación de contraseña
        if (pass1 !== pass2) {
            errores.push("Las contraseñas no coinciden");
        }

        if (errores.length > 0) {
            alert("Errores encontrados:\n- " + errores.join("\n- "));
            return; // Detener el proceso si hay errores
        }

        // Si todo está bien, podrías enviar al servidor
        alert("Registro exitoso");

        const datosUsuario = {
            name: name,
            pat: pat,
            mat: mat,
            email: email,
            phone: phone,
            pass: pass1
        };


        sessionStorage.setItem("user_data", JSON.stringify(datosUsuario));

        //Redireccionamiento
        window.location.href = 'reg_address.html';
    });
});