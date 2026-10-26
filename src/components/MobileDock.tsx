"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCarrito } from "@/lib/cart";

type Destino = "inicio" | "planetas" | "menu";

export function MobileDock() {
  const pathname = usePathname();
  const { cantidadTotal, abrir } = useCarrito();
  const [seccionEnVista, setSeccionEnVista] = useState<Destino | null>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // El estado activo se deriva de la ruta; el scroll spy solo puede ajustarlo.
  const enMenu = pathname === "/menu";
  const activo: Destino = enMenu ? "menu" : (seccionEnVista ?? "inicio");

  // Scroll spy en la home: si el tour de planetas está a la vista, se resalta.
  useEffect(() => {
    if (pathname !== "/") return;
    const seccion = document.getElementById("planetas");
    if (!seccion) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            setSeccionEnVista("planetas");
          } else if (entrada.boundingClientRect.top > 0) {
            setSeccionEnVista(null);
          }
        }
      },
      { threshold: 0.25 },
    );
    observador.observe(seccion);
    return () => observador.disconnect();
  }, [pathname]);

  // Posición de la píldora animada.
  useEffect(() => {
    function colocar() {
      const elemento = track.current?.querySelector<HTMLElement>(`[data-destino="${activo}"]`);
      const barra = pill.current;
      if (!elemento || !barra) return;
      barra.style.width = `${elemento.offsetWidth}px`;
      barra.style.transform = `translateX(${elemento.offsetLeft}px)`;
    }
    colocar();
    window.addEventListener("resize", colocar);
    const destino = window.setTimeout(colocar, 250);
    return () => {
      window.removeEventListener("resize", colocar);
      window.clearTimeout(destino);
    };
  }, [activo, enMenu, pathname]);

  return (
    <div className="dock" role="navigation" aria-label="Principal">
      <div className="track" ref={track}>
        <span className="pill" ref={pill} aria-hidden="true" />
        <Link
          href="/"
          data-destino="inicio"
          className={activo === "inicio" && !enMenu ? "on" : ""}
          aria-current={activo === "inicio" && !enMenu ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />
          </svg>
          <span>Inicio</span>
        </Link>
        <Link
          href="/#planetas"
          data-destino="planetas"
          className={activo === "planetas" ? "on" : ""}
          aria-current={activo === "planetas" ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="5" />
            <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)" />
          </svg>
          <span>Planetas</span>
        </Link>
        <Link
          href="/menu"
          data-destino="menu"
          className={enMenu ? "on" : ""}
          aria-current={enMenu ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10a8 6 0 0 1 16 0z" />
            <path d="M3 13.5h18" />
            <path d="M5 13.5c0 2.5 1 4.5 3 4.5h8c2 0 3-2 3-4.5" />
          </svg>
          <span>Menú</span>
        </Link>
        <button
          type="button"
          onClick={abrir}
          data-cart-target
          aria-label={`Abrir pedido, ${cantidadTotal} productos`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l-1 12H6z" />
            <path d="M9 8a3 3 0 0 1 6 0" />
          </svg>
          <span>Pedido</span>
          <b hidden={cantidadTotal === 0}>{cantidadTotal}</b>
        </button>
      </div>
    </div>
  );
}

export default MobileDock;
