let botonesFiltro = document.querySelectorAll(".filtro");
let itemsGaleria = document.querySelectorAll(".galeria-item");
let contadorGaleria = document.getElementById("galeria-contador");
let visor = null;
let listaVisible = [];
let posicionVisor = 0;

function aplicarFiltro(categoria) {
    let cantidad = 0;

    itemsGaleria.forEach(function (item) {
        let coincide = categoria === "todos" || item.dataset.categoria === categoria;
        item.hidden = !coincide;
        if (coincide) {
            cantidad++;
        }
    });

    botonesFiltro.forEach(function (boton) {
        boton.classList.toggle("activo", boton.dataset.filtro === categoria);
    });

    contadorGaleria.textContent = "Mostrando " + cantidad + (cantidad === 1 ? " imagen" : " imágenes");
}

botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        aplicarFiltro(boton.dataset.filtro);
    });
});

function actualizarVisor() {
    let figura = listaVisible[posicionVisor];
    let imagen = figura.querySelector("img");
    visor.querySelector("img").src = imagen.src;
    visor.querySelector("img").alt = imagen.alt;
    visor.querySelector("p").textContent = figura.querySelector("figcaption").textContent +
        " (" + (posicionVisor + 1) + " de " + listaVisible.length + ")";
}

function moverVisor(paso) {
    posicionVisor = (posicionVisor + paso + listaVisible.length) % listaVisible.length;
    actualizarVisor();
}

function cerrarVisor() {
    if (visor) {
        visor.remove();
        visor = null;
        document.removeEventListener("keydown", teclasVisor);
    }
}

function teclasVisor(evento) {
    if (evento.key === "Escape") {
        cerrarVisor();
    } else if (evento.key === "ArrowLeft") {
        moverVisor(-1);
    } else if (evento.key === "ArrowRight") {
        moverVisor(1);
    }
}

function abrirVisor(figura) {
    listaVisible = Array.from(itemsGaleria).filter(function (item) {
        return !item.hidden;
    });
    posicionVisor = listaVisible.indexOf(figura);

    visor = document.createElement("div");
    visor.className = "visor";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-label", "Imagen ampliada");
    visor.innerHTML =
        '<button type="button" class="v-cerrar" aria-label="Cerrar">×</button>' +
        '<button type="button" class="v-ant" aria-label="Anterior">‹</button>' +
        '<img src="" alt="">' +
        '<p></p>' +
        '<button type="button" class="v-sig" aria-label="Siguiente">›</button>';

    visor.querySelector(".v-cerrar").addEventListener("click", cerrarVisor);
    visor.querySelector(".v-ant").addEventListener("click", function () { moverVisor(-1); });
    visor.querySelector(".v-sig").addEventListener("click", function () { moverVisor(1); });
    visor.addEventListener("click", function (evento) {
        if (evento.target === visor) {
            cerrarVisor();
        }
    });

    document.body.appendChild(visor);
    document.addEventListener("keydown", teclasVisor);
    actualizarVisor();
}

itemsGaleria.forEach(function (item) {
    item.querySelector(".galeria-abrir").addEventListener("click", function () {
        abrirVisor(item);
    });
});

aplicarFiltro("todos");
