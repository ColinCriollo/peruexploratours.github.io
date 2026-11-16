let diapositivas = document.querySelectorAll(".slide");
let contenedorSlider = document.querySelector(".slider");

if (contenedorSlider && diapositivas.length > 0) {

    let indiceActual = 0;
    let temporizador = null;

    let puntosViejos = contenedorSlider.querySelector(".puntos");
    if (puntosViejos) {
        puntosViejos.remove();
    }

    let contenedorPuntos = document.createElement("div");
    contenedorPuntos.className = "puntos";
    let botonesPuntos = [];

    for (let i = 0; i < diapositivas.length; i++) {
        let punto = document.createElement("button");
        punto.type = "button";
        punto.setAttribute("aria-label", "Ir a la imagen " + (i + 1));
        punto.addEventListener("click", function () {
            mostrarDiapositiva(i);
            reiniciarTemporizador();
        });
        contenedorPuntos.appendChild(punto);
        botonesPuntos.push(punto);
    }

    let botonAnterior = document.createElement("button");
    botonAnterior.type = "button";
    botonAnterior.className = "slider-flecha ant";
    botonAnterior.setAttribute("aria-label", "Imagen anterior");
    botonAnterior.textContent = "‹";

    let botonSiguiente = document.createElement("button");
    botonSiguiente.type = "button";
    botonSiguiente.className = "slider-flecha sig";
    botonSiguiente.setAttribute("aria-label", "Imagen siguiente");
    botonSiguiente.textContent = "›";

    contenedorSlider.appendChild(botonAnterior);
    contenedorSlider.appendChild(botonSiguiente);
    contenedorSlider.appendChild(contenedorPuntos);

    function mostrarDiapositiva(numero) {
        indiceActual = (numero + diapositivas.length) % diapositivas.length;

        for (let i = 0; i < diapositivas.length; i++) {
            diapositivas[i].classList.toggle("activa", i === indiceActual);
            botonesPuntos[i].classList.toggle("activo", i === indiceActual);
        }
    }

    function iniciarTemporizador() {
        temporizador = setInterval(function () {
            mostrarDiapositiva(indiceActual + 1);
        }, 5000);
    }

    function reiniciarTemporizador() {
        clearInterval(temporizador);
        iniciarTemporizador();
    }

    botonAnterior.addEventListener("click", function () {
        mostrarDiapositiva(indiceActual - 1);
        reiniciarTemporizador();
    });

    botonSiguiente.addEventListener("click", function () {
        mostrarDiapositiva(indiceActual + 1);
        reiniciarTemporizador();
    });

    contenedorSlider.addEventListener("mouseenter", function () {
        clearInterval(temporizador);
    });

    contenedorSlider.addEventListener("mouseleave", iniciarTemporizador);

    mostrarDiapositiva(0);
    iniciarTemporizador();
}
