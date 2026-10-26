"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, TouchEvent } from "react";
import AgregarButton from "@/components/AgregarButton";
import PlanetOrb from "@/components/PlanetOrb";
import { useCarrito } from "@/lib/cart";
import { BURGUERSAS } from "@/lib/catalog";
import { formatearMoneda } from "@/lib/money";

/** Etiquetas de las tres estadísticas del tour: peso, picor y tiempo. */
const ETIQUETAS_STATS = ["Peso", "Picor", "Tiempo"] as const;

const TOTAL = BURGUERSAS.length;

/**
 * Tour de planetas (id="planetas"): carrusel de las seis hamburguesas.
 *
 * Réplica del carrusel de la landing original: flechas, dots, arrastre con el
 * dedo, teclas ← / → y efecto 3D del orbe al mover el puntero.
 */
export function PlanetTour() {
  const [indice, setIndice] = useState(0);
  const slide = useRef<HTMLDivElement>(null);
  const toqueInicio = useRef<number | null>(null);
  const restaurarFoco = useRef(false);
  const reducirMovimiento = useRef(false);
  // El carrito es global: si el cajón está abierto, el tour no debe reaccionar.
  const { abierto } = useCarrito();

  const producto = BURGUERSAS[indice];

  /** Cambia de planeta con vuelta infinita y conserva el foco si estaba dentro. */
  const cambiar = useCallback(
    (destino: number) => {
      const objetivo = ((destino % TOTAL) + TOTAL) % TOTAL;
      if (objetivo === indice) {
        restaurarFoco.current = false;
        return;
      }
      const activo = document.activeElement;
      restaurarFoco.current = Boolean(
        activo && slide.current && slide.current.contains(activo),
      );
      setIndice(objetivo);
    },
    [indice],
  );

  // Al cambiar de planeta se recrea el slide (key), así que el foco se
  // devuelve al botón de agregar de la nueva diapositiva.
  useEffect(() => {
    if (!restaurarFoco.current) return;
    restaurarFoco.current = false;
    slide.current?.querySelector<HTMLElement>("button[data-add]")?.focus();
  }, [indice]);

  // Teclado: ← / → cambian de planeta salvo que se esté editando un campo.
  useEffect(() => {
    function alPulsar(evento: KeyboardEvent) {
      if (evento.defaultPrevented) return;
      if (evento.altKey || evento.ctrlKey || evento.metaKey) return;
      const destino = evento.target;
      if (destino instanceof HTMLElement) {
        if (destino.isContentEditable) return;
        const etiqueta = destino.tagName;
        if (
          etiqueta === "INPUT" ||
          etiqueta === "TEXTAREA" ||
          etiqueta === "SELECT"
        ) {
          return;
        }
      }
      if (abierto) return;
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        cambiar(indice - 1);
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        cambiar(indice + 1);
      }
    }

    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierto, indice, cambiar]);

  // Respeta la preferencia de movimiento reducido (sin efecto 3D).
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => {
      reducirMovimiento.current = consulta.matches;
    };
    actualizar();
    consulta.addEventListener("change", actualizar);
    return () => consulta.removeEventListener("change", actualizar);
  }, []);

  /** Efecto 3D: el orbe sigue al puntero. */
  const alMover = useCallback((evento: PointerEvent<HTMLDivElement>) => {
    const elemento = slide.current;
    if (!elemento || reducirMovimiento.current) return;
    const rect = elemento.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const giroY = ((evento.clientX - rect.left) / rect.width - 0.5) * 26;
    const giroX = ((evento.clientY - rect.top) / rect.height - 0.5) * -22;
    elemento.style.setProperty("--ry", `${giroY.toFixed(2)}deg`);
    elemento.style.setProperty("--rx", `${giroX.toFixed(2)}deg`);
  }, []);

  const alSalir = useCallback(() => {
    const elemento = slide.current;
    if (!elemento) return;
    elemento.style.setProperty("--ry", "0deg");
    elemento.style.setProperty("--rx", "0deg");
  }, []);

  /** Arrastre con el dedo. */
  const alTocarInicio = (evento: TouchEvent<HTMLDivElement>) => {
    const toques = evento.touches;
    toqueInicio.current = toques.length > 0 ? toques[0].clientX : null;
  };

  const alTocarFin = (evento: TouchEvent<HTMLDivElement>) => {
    const inicio = toqueInicio.current;
    toqueInicio.current = null;
    if (inicio === null) return;
    const toques = evento.changedTouches;
    if (toques.length === 0) return;
    const delta = toques[0].clientX - inicio;
    if (Math.abs(delta) <= 50) return;
    cambiar(indice + (delta < 0 ? 1 : -1));
  };

  return (
    <section
      className="tour"
      id="planetas"
      aria-roledescription="carousel"
      aria-labelledby="titulo-planetas"
    >
      <div className="wrap">
        <h2 className="title" id="titulo-planetas">
          El sistema solar{" "}
          <br />
          de las hamburguesas
        </h2>
        <p className="sub">
          Desliza entre planetas y conoce cada hamburguesa antes de pedirla.
        </p>

        <p className="sr-only" aria-live="polite">
          {`Planeta ${indice + 1} de ${TOTAL}: ${producto.nombre}`}
        </p>

        <div className="stage">
          <button
            type="button"
            className="arrow"
            onClick={() => cambiar(indice - 1)}
            aria-label="Planeta anterior"
          >
            <svg
              viewBox="0 0 22 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M20 2 2 30l18 28" />
            </svg>
          </button>

          {/* La key fuerza el remount: así la animación `.slide.in` se repite. */}
          <div
            className="slide in"
            key={indice}
            ref={slide}
            onPointerMove={alMover}
            onPointerLeave={alSalir}
            onTouchStart={alTocarInicio}
            onTouchEnd={alTocarFin}
          >
            <div>
              <h3 className="vname">{producto.nombre.toUpperCase()}</h3>
              {producto.etiqueta ? (
                <p className="tag">{producto.etiqueta}</p>
              ) : null}
              <p className="desc">{producto.descripcion}</p>
              <div className="stats">
                {producto.stats?.map((valor, i) => (
                  <div key={ETIQUETAS_STATS[i]}>
                    {ETIQUETAS_STATS[i]}
                    <b>{valor}</b>
                  </div>
                ))}
              </div>
              <div className="cta">
                <span className="price">
                  {formatearMoneda(producto.precio)}
                </span>
                <AgregarButton id={producto.id} className="btn fill">
                  Agregar al pedido
                </AgregarButton>
              </div>
            </div>
            <div className="planetbox">
              <PlanetOrb producto={producto} />
            </div>
          </div>

          <button
            type="button"
            className="arrow"
            onClick={() => cambiar(indice + 1)}
            aria-label="Planeta siguiente"
          >
            <svg
              viewBox="0 0 22 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M2 2l18 28L2 58" />
            </svg>
          </button>
        </div>

        <div className="dots">
          {BURGUERSAS.map((planeta, i) => (
            <button
              key={planeta.id}
              type="button"
              aria-label={`Ir a ${planeta.nombre}`}
              aria-current={i === indice}
              onClick={() => cambiar(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlanetTour;
