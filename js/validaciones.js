const nombreAgencia="Perú Explora Tours";
function validarDNI(dni) {
    let expresionDNI = /^[0-9]{8}$/;
    return expresionDNI.test(dni);
}

function validarPuntuacion(puntuacion) {
    let valorPuntuacion = Number(puntuacion);
    return puntuacion !== "" && Number.isFinite(valorPuntuacion) &&
           valorPuntuacion >= 0 && valorPuntuacion <= 20;
}

function validarViajeros(viajeros) {
    return Number.isInteger(viajeros) && viajeros >= 1 && viajeros <= 30;
}

function mostrarError(campo, mensaje) {
    campo.setCustomValidity(mensaje);
    campo.reportValidity();
    campo.focus();
}

function mostrarModalExito(dni, puntuacion, viajeros) {

    let modal = document.createElement("div");
    modal.className = "modal-fondo";

    modal.innerHTML =
        '<div class="modal-caja">' +
            '<div class="modal-icono">✓</div>' +
            '<h2>¡Datos validados correctamente!</h2>' +
            '<p class="modal-subtitulo">' +
                ((Number(puntuacion) >= 14) ? "¡Gracias por tu buena calificación!" : "Gracias, trabajaremos para mejorar tu experiencia.") +
            '</p>' +

            '<div class="ticket">' +
                '<div class="ticket-cabecera">' +
                    '<span>' + nombreAgencia + '</span>' +
                    '<small>Resumen de viaje</small>' +
                '</div>' +
                '<div class="ticket-cuerpo">' +
                    '<div class="ticket-dato">' +
                        '<small>DNI del titular</small>' +
                        '<strong>' + dni + '</strong>' +
                    '</div>' +
                    '<div class="ticket-dato">' +
                        '<small>' + ((viajeros == 1) ? "Viajero" : "Viajeros") + '</small>' +
                        '<strong>' + viajeros + '</strong>' +
                    '</div>' +
                    '<div class="ticket-dato">' +
                        '<small>Calificación</small>' +
                        '<strong>' + puntuacion + ' / 20</strong>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<button type="button" class="modal-boton">Aceptar</button>' +
        '</div>';

    document.body.appendChild(modal);

    function cerrarModal() {
        modal.classList.add("modal-cerrando");
        setTimeout(function() { modal.remove(); }, 250);
    }

    modal.querySelector(".modal-boton").addEventListener("click", cerrarModal);

    modal.addEventListener("click", function(evento) {
        if (evento.target === modal) {
            cerrarModal();
        }
    });
}

let formulario = document.getElementById("formulario-contacto");

if (formulario) {

    let campoDNI = document.getElementById("dni");
    let campoPuntuacion = document.getElementById("puntuacion");
    let campoViajeros = document.getElementById("viajeros");
    let campoNombres = document.getElementById("nombres");
    let campoApellidos = document.getElementById("apellidos");
    let campoCorreo = document.getElementById("correo");
    let campoMensaje = document.getElementById("mensaje");

    [campoDNI, campoPuntuacion, campoViajeros, campoNombres, campoApellidos, campoCorreo, campoMensaje].forEach(function(campo) {
        campo.addEventListener("input", function() {
            campo.setCustomValidity("");
        });
    });

    formulario.addEventListener("submit", function(evento) {

        evento.preventDefault();

        let dni = campoDNI.value.trim();
        let puntuacion = campoPuntuacion.value.trim();
        let viajeros = Number(campoViajeros.value);

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,40}$/.test(campoNombres.value.trim())) {
            mostrarError(campoNombres, "Los nombres solo deben tener letras (mínimo 2).");
            return;
        }

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,40}$/.test(campoApellidos.value.trim())) {
            mostrarError(campoApellidos, "Los apellidos solo deben tener letras (mínimo 2).");
            return;
        }

        if (!validarDNI(dni)) {
            mostrarError(campoDNI, "El DNI debe contener exactamente 8 números.");
            return;
        }

        if (!validarPuntuacion(puntuacion)) {
            mostrarError(campoPuntuacion, "La calificación debe ser un número entre 0 y 20.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campoCorreo.value.trim())) {
            mostrarError(campoCorreo, "Ingresa un correo válido, por ejemplo ejemplo@correo.com.");
            return;
        }

        if (!validarViajeros(viajeros)) {
            mostrarError(campoViajeros, "La cantidad de viajeros debe estar entre 1 y 30.");
            return;
        }

        if (campoMensaje.value.trim().length < 10) {
            mostrarError(campoMensaje, "El mensaje debe tener al menos 10 caracteres.");
            return;
        }

        let mensajeConfirmacion =
            "¿Deseas enviar tu solicitud?\n\n" +
            "DNI: " + dni + "\n" +
            ((viajeros == 1) ? "Viajero: " : "Viajeros: ") + viajeros + "\n" +
            "Calificación: " + puntuacion + "/20";

        let respuesta = confirm(mensajeConfirmacion);

        if (respuesta) {
            DB.set("mensajes", [...DB.get("mensajes"), {fecha:new Date().toISOString(),nombre:campoNombres.value+" "+campoApellidos.value,correo:campoCorreo.value,mensaje:campoMensaje.value,puntuacion,viajeros}]);
            mostrarModalExito(dni, puntuacion, viajeros);
            formulario.reset();
        } else {
            campoDNI.focus();
        }
    });
}

let filas = document.querySelectorAll("#tabla-paquetes tbody tr");

filas.forEach(function(fila) {
    fila.addEventListener("mouseenter", function() {
        fila.classList.add("fila-resaltada");
    });
    fila.addEventListener("mouseleave", function() {
        fila.classList.remove("fila-resaltada");
    });
});

let nombresPaquetes = new Array();
nombresPaquetes[0] = "Cusco Mágico";
nombresPaquetes[1] = "Arequipa y Colca";
nombresPaquetes[2] = "Puno y Lago Titicaca";
nombresPaquetes[3] = "Paracas Full Day";

let preciosPaquetes = new Array();
preciosPaquetes[0] = 1450;
preciosPaquetes[1] = 980;
preciosPaquetes[2] = 890;
preciosPaquetes[3] = 650;

function mostrarRecomendacion() {

    let destino = document.getElementById("destino").value;
    let texto;

    switch (destino) {
        case "Cusco y Machu Picchu":
            texto = "Cusco está a más de 3,300 m s. n. m.: lleva ropa abrigadora y descansa el primer día.";
            break;
        case "Arequipa y Colca":
            texto = "En el Colca las mañanas son frías: lleva casaca, gorro y protector solar.";
            break;
        case "Puno y Lago Titicaca":
            texto = "Puno es uno de los destinos más fríos: lleva ropa térmica y guantes.";
            break;
        case "Paracas":
            texto = "En Paracas hace sol y viento: lleva lentes de sol, gorra y bloqueador.";
            break;
        default:
            texto = "";
    }

    document.getElementById("recomendacion-destino").textContent = texto;
}

function generarTablaDoble() {

    let campoMax = document.getElementById("doble-max");
    let maximo = Number(campoMax.value);

    if (!Number.isInteger(maximo) || maximo < 1 || maximo > 12) {
        mostrarError(campoMax, "Ingresa un número entero entre 1 y 12.");
        return;
    }

    let tabla = '<table class="tabla-doble">' +
                '<thead><tr><th>Paquete / Viajeros</th>';

    for (let c = 1; c <= maximo; c++) {
        tabla += '<th>' + c + '</th>';
    }

    tabla += '</tr></thead><tbody>';

    for (let i = 0; i < nombresPaquetes.length; i++) {

        tabla += '<tr><th>' + nombresPaquetes[i] + '</th>';

        for (let c = 1; c <= maximo; c++) {
            tabla += '<td>S/ ' + (preciosPaquetes[i] * c) + '</td>';
        }

        tabla += '</tr>';
    }

    tabla += '</tbody></table>';

    document.getElementById("doble-resultado").innerHTML = tabla;
}