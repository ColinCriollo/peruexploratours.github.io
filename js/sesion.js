(function () {
    var usuario = sessionStorage.getItem("usuarioActivo");

    if (!usuario) {
        window.location.replace("login.html");
        return;
    }

    document.addEventListener("DOMContentLoaded", function () {
        var lista = document.querySelector(".main-nav ul");

        if (!lista) {
            return;
        }

        var item = document.createElement("li");
        var enlace = document.createElement("a");

        enlace.href = "login.html";
        enlace.className = "cerrar-sesion";
        enlace.title = "Sesión de " + usuario;
        enlace.textContent = "Cerrar sesión";

        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();
            sessionStorage.removeItem("usuarioActivo");
            window.location.replace("login.html");
        });

        item.appendChild(enlace);
        lista.appendChild(item);
    });
})();
