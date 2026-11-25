let formularioCompra = document.getElementById("formulario-compra");

if (formularioCompra) {

    let campoPaquete = document.getElementById("paquete");
    let campoPersonas = document.getElementById("personas");
    let campoFecha = document.getElementById("fecha");
    let campoNombre = document.getElementById("nombre");
    let campoDni = document.getElementById("dni");
    let campoMetodo = document.getElementById("metodo");
    let campoTerminos = document.getElementById("terminos");
    let campoTarjeta = document.getElementById("tarjeta-numero");
    let campoTitular = document.getElementById("tarjeta-titular");
    let campoVence = document.getElementById("tarjeta-vence");
    let campoCvv = document.getElementById("tarjeta-cvv");
    let campoCelular = document.getElementById("billetera-celular");
    let campoCodigo = document.getElementById("billetera-codigo");
    let campoBanco = document.getElementById("transferencia-banco");
    let campoOperacion = document.getElementById("transferencia-operacion");

    let hoy = new Date();
    let hoyTexto = hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");
    campoFecha.min = hoyTexto;

    let paqueteUrl = new URLSearchParams(window.location.search).get("paquete");
    if (paqueteUrl) {
        campoPaquete.value = paqueteUrl;
    }

    function dinero(valor) {
        return "S/ " + valor.toFixed(2);
    }

    function calcular() {
        let opcion = campoPaquete.options[campoPaquete.selectedIndex];
        let precio = opcion.dataset.precio ? Number(opcion.dataset.precio) : 0;
        let personas = Number(campoPersonas.value);

        if (!Number.isInteger(personas) || personas < 1) {
            personas = 0;
        }

        let subtotal = precio * personas;
        let descuento = personas >= 5 ? subtotal * 0.10 : 0;
        let total = subtotal - descuento;
        let igv = total - total / 1.18;

        return { opcion: opcion, precio: precio, personas: personas, subtotal: subtotal, descuento: descuento, igv: igv, total: total };
    }

    function actualizarResumen() {
        let datos = calcular();
        let nombrePaquete = datos.precio > 0 ? datos.opcion.textContent.split(" - ")[0] : "-";

        document.getElementById("r-paquete").textContent = nombrePaquete;
        document.getElementById("r-precio").textContent = dinero(datos.precio);
        document.getElementById("r-personas").textContent = datos.personas;
        document.getElementById("r-subtotal").textContent = dinero(datos.subtotal);
        document.getElementById("r-descuento").textContent = "- " + dinero(datos.descuento);
        document.getElementById("r-igv").textContent = dinero(datos.igv);
        document.getElementById("r-total").textContent = dinero(datos.total);
    }

    function marcarError(campo, mensaje) {
        campo.setCustomValidity(mensaje);
        campo.reportValidity();
        campo.focus();
    }

    [campoPaquete, campoPersonas, campoFecha, campoNombre, campoDni, campoMetodo, campoTerminos].forEach(function (campo) {
        campo.addEventListener("input", function () {
            campo.setCustomValidity("");
            actualizarResumen();
        });
        campo.addEventListener("change", function () {
            campo.setCustomValidity("");
            actualizarResumen();
        });
    });

    function mostrarCamposPago() {
        let metodo = campoMetodo.value;
        document.getElementById("pago-tarjeta").hidden = metodo !== "Tarjeta";
        document.getElementById("pago-billetera").hidden = metodo !== "Yape" && metodo !== "Plin";
        document.getElementById("pago-transferencia").hidden = metodo !== "Transferencia";

        if (metodo === "Yape" || metodo === "Plin") {
            document.getElementById("etiqueta-celular").textContent = "Número de celular de " + metodo;
        }
    }

    function soloNumeros(campo) {
        campo.addEventListener("input", function () {
            campo.value = campo.value.replace(/[^0-9]/g, "");
        });
    }

    [campoCvv, campoCelular, campoCodigo, campoOperacion].forEach(soloNumeros);

    campoTarjeta.addEventListener("input", function () {
        let digitos = campoTarjeta.value.replace(/[^0-9]/g, "").slice(0, 16);
        campoTarjeta.value = digitos.replace(/(.{4})/g, "$1 ").trim();
    });

    campoVence.addEventListener("input", function () {
        let digitos = campoVence.value.replace(/[^0-9]/g, "").slice(0, 4);
        campoVence.value = digitos.length > 2 ? digitos.slice(0, 2) + "/" + digitos.slice(2) : digitos;
    });

    campoMetodo.addEventListener("change", mostrarCamposPago);

    [campoTarjeta, campoTitular, campoVence, campoCvv, campoCelular, campoCodigo, campoBanco, campoOperacion].forEach(function (campo) {
        campo.addEventListener("input", function () {
            campo.setCustomValidity("");
        });
        campo.addEventListener("change", function () {
            campo.setCustomValidity("");
        });
    });

    function validarPago(metodo) {
        if (metodo === "Tarjeta") {
            let numero = campoTarjeta.value.replace(/ /g, "");

            if (!/^[0-9]{16}$/.test(numero)) {
                marcarError(campoTarjeta, "El número de tarjeta debe tener 16 dígitos.");
                return null;
            }

            if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{5,40}$/.test(campoTitular.value.trim())) {
                marcarError(campoTitular, "Ingresa el nombre del titular usando solo letras.");
                return null;
            }

            let partes = campoVence.value.split("/");
            let mes = Number(partes[0]);
            let anio = 2000 + Number(partes[1]);

            if (!/^[0-9]{2}\/[0-9]{2}$/.test(campoVence.value) || mes < 1 || mes > 12) {
                marcarError(campoVence, "Ingresa el vencimiento con el formato MM/AA.");
                return null;
            }

            if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
                marcarError(campoVence, "La tarjeta está vencida.");
                return null;
            }

            if (!/^[0-9]{3,4}$/.test(campoCvv.value)) {
                marcarError(campoCvv, "El CVV debe tener 3 o 4 dígitos.");
                return null;
            }

            return "Tarjeta terminada en " + numero.slice(-4);
        }

        if (metodo === "Yape" || metodo === "Plin") {
            if (!/^9[0-9]{8}$/.test(campoCelular.value)) {
                marcarError(campoCelular, "El celular debe tener 9 dígitos y empezar con 9.");
                return null;
            }

            if (!/^[0-9]{6}$/.test(campoCodigo.value)) {
                marcarError(campoCodigo, "El código de aprobación debe tener 6 dígitos.");
                return null;
            }

            return metodo + " al celular ***" + campoCelular.value.slice(-3);
        }

        if (campoBanco.value === "") {
            marcarError(campoBanco, "Selecciona el banco de origen.");
            return null;
        }

        if (!/^[0-9]{8,12}$/.test(campoOperacion.value)) {
            marcarError(campoOperacion, "El número de operación debe tener entre 8 y 12 dígitos.");
            return null;
        }

        return campoBanco.value + ", operación " + campoOperacion.value;
    }

    function mostrarBoleta(datos,nombre,dni,metodo,fecha,detalle){
        const u=activo();if(!u){location.reload();return;}
        const compra={codigo:crypto.randomUUID(),emision:new Date().toISOString(),usuario:u.usuario,correo:u.correo||'',nombre,dni,paquete:datos.opcion.textContent.split(' - ')[0],personas:datos.personas,fecha,metodo,detalle,precio:datos.precio,subtotal:datos.subtotal,descuento:datos.descuento,igv:datos.igv,total:datos.total,estado:'Confirmada'};
        DB.set('compras',[...DB.get('compras'),compra]);verBoleta(compra);
    }
    formularioCompra.addEventListener("submit", function (evento) {
        evento.preventDefault();

        let datos = calcular();
        let nombre = campoNombre.value.trim();
        let dni = campoDni.value.trim();

        if (campoPaquete.value === "") {
            marcarError(campoPaquete, "Selecciona un paquete.");
            return;
        }

        let personas = Number(campoPersonas.value);
        if (!Number.isInteger(personas) || personas < 1 || personas > 20) {
            marcarError(campoPersonas, "El número de personas debe estar entre 1 y 20.");
            return;
        }

        if (campoFecha.value === "" || campoFecha.value < hoyTexto) {
            marcarError(campoFecha, "Elige una fecha de viaje desde hoy en adelante.");
            return;
        }

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{5,60}$/.test(nombre) || nombre.indexOf(" ") === -1) {
            marcarError(campoNombre, "Ingresa nombres y apellidos usando solo letras.");
            return;
        }

        if (!/^[0-9]{8}$/.test(dni)) {
            marcarError(campoDni, "El DNI debe contener exactamente 8 números.");
            return;
        }

        if (campoMetodo.value === "") {
            marcarError(campoMetodo, "Selecciona un método de pago.");
            return;
        }

        let detallePago = validarPago(campoMetodo.value);

        if (detallePago === null) {
            return;
        }

        if (!campoTerminos.checked) {
            marcarError(campoTerminos, "Debes aceptar los términos y condiciones.");
            return;
        }

        mostrarBoleta(datos, nombre, dni, campoMetodo.value, campoFecha.value, detallePago);
        formularioCompra.reset();
        mostrarCamposPago();
        campoFecha.min = hoyTexto;
        actualizarResumen();
    });

    if(activo()){campoNombre.value=activo().nombre||"";campoDni.value=activo().dni||"";}
    actualizarResumen();
    mostrarCamposPago();
}
