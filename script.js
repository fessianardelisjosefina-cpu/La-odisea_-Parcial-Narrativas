/* LA ODISEA · script.js
   - Aparición progresiva (IntersectionObserver)
   - Parallax por capas
   - Barra de progreso del recorrido vertical
   - Detección de dispositivos táctiles
*/
(function () {
  "use strict";

  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tactil = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (tactil) document.documentElement.classList.add("tactil");

  /* ---------- Aparición al entrar en pantalla ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reducir || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Parallax + progreso ---------- */
  var capas = document.querySelectorAll("[data-velocidad]");
  var fondoImg = document.querySelector(".fondo__img, .fondo__video");
  var ticking = false;

  function actualizar() {
    var y = window.scrollY || window.pageYOffset;
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--progreso", alto > 0 ? (y / alto).toFixed(4) : 0);

    if (!reducir) {
      var vh = window.innerHeight;
      capas.forEach(function (el) {
        var padre = el.parentElement.getBoundingClientRect();
        var centro = padre.top + padre.height / 2 - vh / 2;
        var v = parseFloat(el.getAttribute("data-velocidad")) || 0;
        el.style.transform = "translate3d(0," + (centro * v).toFixed(1) + "px,0)";
      });
    }
    ticking = false;
  }

  function pedir() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(actualizar);
    }
  }

  window.addEventListener("scroll", pedir, { passive: true });
  window.addEventListener("resize", pedir);
  actualizar();
})();
