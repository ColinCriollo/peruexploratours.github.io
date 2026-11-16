let usuarios = new Array("admin", "cliente", "viajero");
let claves = new Array("Admin123", "Cliente123", "Viajero123");

if (sessionStorage.getItem("usuarioActivo")) {
    window.location.replace("index.html");
}

let formularioLogin = document.getElementById("formulario-login");
let campoUsuario = document.getElementById("usuario");
let campoClave = document.getElementById("clave");
let botonVer = document.getElementById("ver-clave");
let cuadroError = document.getElementById("login-error");
let botonEntrar = document.getElementById("entrar");
let intentosFallidos = 0;

function mostrarMensaje(texto, campo) {
    cuadroError.textContent = texto;
    cuadroError.hidden = false;
    if (campo) {
        campo.focus();
    }
}

botonVer.addEventListener("click", function () {
    let oculta = campoClave.type === "password";
    campoClave.type = oculta ? "text" : "password";
    botonVer.textContent = oculta ? "Ocultar" : "Ver";
});

formularioLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();
    cuadroError.hidden = true;

    let usuario = campoUsuario.value.trim().toLowerCase();
    let clave = campoClave.value;

    if (usuario === "") {
        mostrarMensaje("Ingresa tu usuario.", campoUsuario);
        return;
    }

    if (!/^[a-z0-9_]{4,15}$/.test(usuario)) {
        mostrarMensaje("El usuario debe tener de 4 a 15 caracteres: letras, números o guion bajo.", campoUsuario);
        return;
    }

    if (clave === "") {
        mostrarMensaje("Ingresa tu contraseña.", campoClave);
        return;
    }

    if (clave.length < 6) {
        mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", campoClave);
        return;
    }

    let posicion = usuarios.indexOf(usuario);

    if (posicion === -1 || claves[posicion] !== clave) {
        intentosFallidos++;
        campoClave.value = "";

        if (intentosFallidos >= 3) {
            botonEntrar.disabled = true;
            mostrarMensaje("Demasiados intentos fallidos. Espera 15 segundos para volver a intentar.");
            setTimeout(function () {
                botonEntrar.disabled = false;
                intentosFallidos = 0;
                cuadroError.hidden = true;
            }, 15000);
            return;
        }

        mostrarMensaje("Usuario o contraseña incorrectos. Intento " + intentosFallidos + " de 3.", campoClave);
        return;
    }

    sessionStorage.setItem("usuarioActivo", usuarios[posicion]);
    window.location.replace("index.html");
});
