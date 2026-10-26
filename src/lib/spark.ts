"use client";

/**
 * Chispa que "vuela" desde el botón de agregar hasta el botón del carrito.
 * Reemplaza la animación `fly` de la landing original.
 */
export function dispararChispa(origen: HTMLElement): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Puede haber variostargets (header en escritorio, dock en móvil): se usa el visible.
  const destino = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cart-target]"),
  ).find((elemento) => elemento.offsetParent !== null);
  if (!destino) return;

  const a = origen.getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - ax;
  const dy = b.top + b.height / 2 - ay;

  const chispa = document.createElement("div");
  chispa.className = "spark";
  chispa.style.left = `${ax}px`;
  chispa.style.top = `${ay}px`;
  document.body.appendChild(chispa);

  const animacion = chispa.animate(
    [
      { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
      {
        transform: `translate(calc(-50% + ${dx * 0.5}px),calc(-50% + ${dy * 0.5 - 90}px)) scale(1.5)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.2)`, opacity: 0 },
    ],
    { duration: 750, easing: "cubic-bezier(.4,0,.2,1)" },
  );

  animacion.onfinish = () => chispa.remove();
}
