// js/carousel.js
(function () {
  const root = document.querySelector(".carousel");
  if (!root) return; // seguridad por si no existe el carrusel

  const track = root.querySelector(".carousel__track");
  const slides = Array.from(root.querySelectorAll(".carousel__slide"));
  const prevBtn = root.querySelector(".carousel__btn.prev");
  const nextBtn = root.querySelector(".carousel__btn.next");
  const dotsWrap = root.querySelector(".carousel__dots");

  let index = 0;
  let autoplay = true;
  const intervalMs = 2000;
  let timer = null;

  // Crear dots dinámicamente
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.role = "tab";
    b.ariaLabel = `Ir al slide ${i + 1}`;
    b.ariaSelected = i === 0 ? "true" : "false";
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle("is-current", i === index));
    dots.forEach((d, i) =>
      d.setAttribute("aria-selected", i === index ? "true" : "false")
    );
  }

  function goTo(i, user = false) {
    index = (i + slides.length) % slides.length;
    update();
    if (user) restartAutoplay();
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }

  // Eventos flechas
  nextBtn.addEventListener("click", () => goTo(index + 1, true));
  prevBtn.addEventListener("click", () => goTo(index - 1, true));

  // Teclado
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") goTo(index + 1, true);
    if (e.key === "ArrowLeft") goTo(index - 1, true);
  });
  root.tabIndex = 0;

  // Swipe (touch + mouse)
  let startX = 0,
    dx = 0,
    dragging = false;
  const viewport = root.querySelector(".carousel__viewport");

  function onStart(x) {
    dragging = true;
    startX = x;
    dx = 0;
    track.style.transition = "none";
  }
  function onMove(x) {
    if (!dragging) return;
    dx = x - startX;
    track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
  }
  function onEnd() {
    if (!dragging) return;
    track.style.transition = "";
    const threshold = viewport.clientWidth * 0.15;
    if (dx > threshold) goTo(index - 1, true);
    else if (dx < -threshold) goTo(index + 1, true);
    else update();
    dragging = false;
    dx = 0;
  }

  // Touch
  viewport.addEventListener(
    "touchstart",
    (e) => onStart(e.touches[0].clientX),
    { passive: true }
  );
  viewport.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), {
    passive: true,
  });
  viewport.addEventListener("touchend", onEnd);

  // Mouse
  viewport.addEventListener("mousedown", (e) => onStart(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);

  // Autoplay
  function startAutoplay() {
    if (!autoplay) return;
    stopAutoplay();
    timer = setInterval(next, intervalMs);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  // Inicializar
  update();
  startAutoplay();
})();

datos = {
  nombre: "",
  email: "",
  mensaje: "",
};

const inputsForm = document.querySelectorAll(
  ".formulario div input, .formulario textarea"
);

for (const input of inputsForm) {
  input.addEventListener("change", function (eventoActual) {
    datos[eventoActual.target.id] = eventoActual.target.value;
  });
}

const formulario = document.querySelector(".formulario");
formulario.addEventListener("submit", function (eventoActual) {
  eventoActual.preventDefault();

  limpiarErroresPrevios();

  for (const f of inputsForm) {
    // console.log(datos[f.id]);
    const resultado = validarInput(f.id, datos[f.id]);
    if (resultado !== null) {
      const parrafoError = document.createElement("DIV");
      parrafoError.textContent = resultado;
      parrafoError.classList.add("errorForm");
      f.insertAdjacentElement("afterend", parrafoError);
    }
  }
  if (document.querySelector(".formEnviado")) {
    document.querySelector(".formEnviado").remove();
  }
  const hayErrores = document.querySelector(".errorForm");
  if (!hayErrores) {
    // console.log("NO HYA ERRORES");
    const mensajeEnviadoExitoso = document.createElement("DIV");
    mensajeEnviadoExitoso.classList.add("formEnviado");
    mensajeEnviadoExitoso.textContent = "FORMULARIO ENVIADO CORRECTAMENTE";
    formulario.appendChild(mensajeEnviadoExitoso);
    alert("Formulario enviado");
    formulario.reset();
  }
});

function validarInput(idInput, valorInput) {
  return valorInput.length === 0 ? `El ${idInput} no puede estar vacio` : null;
}

// Hay que limpiar esos nodos HTML xq no se limpian solo.
// Una vez que agregamos un nodo ese queda vivo hasta que lo saquemos.
function limpiarErroresPrevios() {
  // 1 -> Seleccionamos nodos
  // 2 -> Recorremos uno por uno y los vamos eliminando;
  const erroresPrevios = document.querySelectorAll(".errorForm");
  for (const error of erroresPrevios) {
    error.remove();
  }
}
