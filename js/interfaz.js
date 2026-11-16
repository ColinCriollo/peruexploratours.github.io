(function () {
    var guardado = null;

    try {
        guardado = localStorage.getItem("tema");
    } catch (error) {
        guardado = null;
    }

    var tema = guardado === "oscuro" ? "oscuro" : "claro";
    document.documentElement.setAttribute("data-tema", tema);

    document.addEventListener("DOMContentLoaded", function () {
        var boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-tema";

        function pintar() {
            var proximo = tema === "oscuro" ? "claro" : "oscuro";
            boton.textContent = tema === "oscuro" ? "☀" : "☾";
            boton.title = "Cambiar a modo " + proximo;
            boton.setAttribute("aria-label", "Cambiar a modo " + proximo);
        }

        boton.addEventListener("click", function () {
            tema = tema === "oscuro" ? "claro" : "oscuro";
            document.documentElement.setAttribute("data-tema", tema);
            try {
                localStorage.setItem("tema", tema);
            } catch (error) {
                guardado = null;
            }
            pintar();
        });

        pintar();

        var lista = document.querySelector(".main-nav ul");

        if (lista) {
            var item = document.createElement("li");
            item.appendChild(boton);
            lista.appendChild(item);
        } else {
            var barra = document.querySelector(".header-bar");
            if (barra) {
                barra.appendChild(boton);
            }
        }

        var casilla = document.getElementById("menu-toggle");
        var botonMenu = document.querySelector(".menu-btn");
        var navegacion = document.querySelector(".main-nav");

        if (casilla && botonMenu && navegacion) {
            function sincronizar() {
                botonMenu.classList.toggle("abierto", casilla.checked);
                navegacion.classList.toggle("abierto", casilla.checked);
                botonMenu.setAttribute("aria-expanded", casilla.checked ? "true" : "false");
            }

            casilla.addEventListener("change", sincronizar);

            navegacion.addEventListener("click", function (evento) {
                if (evento.target.closest("a") && casilla.checked) {
                    casilla.checked = false;
                    sincronizar();
                }
            });

            document.addEventListener("keydown", function (evento) {
                if (evento.key === "Escape" && casilla.checked) {
                    casilla.checked = false;
                    sincronizar();
                }
            });

            sincronizar();
        }
    });
})();
