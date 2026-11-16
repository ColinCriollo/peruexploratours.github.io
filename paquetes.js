let formularioPaquete = document.querySelector("form");

if (formularioPaquete) {

    let campoNombre = document.getElementById("nombre");
    let campoCorreo = document.getElementById("correo");
    let campoPersonas = document.getElementById("personas");
    let campoFecha = document.getElementById("fecha");
    let campoPaquete = document.getElementById("paquete");

    let hoy = new Date();
    let hoyTexto = hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");

    campoFecha.min = hoyTexto;

    function marcarError(campo, mensaje) {
        campo.setCustomValidity(mensaje);
        campo.reportValidity();
        campo.focus();
    }

    [campoNombre, campoCorreo, campoPersonas, campoFecha].forEach(function (campo) {
        campo.addEventListener("input", function () {
            campo.setCustomValidity("");
        });
    });

    formularioPaquete.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let nombre = campoNombre.value.trim();
        let correo = campoCorreo.value.trim();
        let personas = Number(campoPersonas.value);
        let fecha = campoFecha.value;

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,60}$/.test(nombre)) {
            marcarError(campoNombre, "El nombre debe tener solo letras y entre 3 y 60 caracteres.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            marcarError(campoCorreo, "Ingresa un correo válido, por ejemplo ejemplo@correo.com.");
            return;
        }

        if (!Number.isInteger(personas) || personas < 1 || personas > 20) {
            marcarError(campoPersonas, "El número de personas debe estar entre 1 y 20.");
            return;
        }

        if (fecha === "" || fecha < hoyTexto) {
            marcarError(campoFecha, "Elige una fecha de viaje desde hoy en adelante.");
            return;
        }

        let anterior = document.getElementById("mensaje-solicitud");
        if (anterior) {
            anterior.remove();
        }

        let partes = fecha.split("-");
        let aviso = document.createElement("p");
        aviso.id = "mensaje-solicitud";
        aviso.className = "mensaje-ok";
        aviso.setAttribute("role", "status");
        aviso.textContent = "Solicitud registrada: " + nombre + ", " + campoPaquete.value + ", " +
            personas + (personas === 1 ? " persona" : " personas") + ", salida " +
            partes[2] + "/" + partes[1] + "/" + partes[0] + ".";

        formularioPaquete.appendChild(aviso);
        formularioPaquete.reset();
        campoFecha.min = hoyTexto;
    });
}
