"use client";

import { useEffect, useRef } from "react";
import CartLines from "./CartLines";
import CheckoutForm from "./CheckoutForm";
import { useCarrito } from "@/lib/cart";
import { formatearMoneda } from "@/lib/money";

/** Elementos que participan en el recorrido del foco dentro del drawer. */
const FOCALIZABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Drawer global del pedido: es el panel lateral de la landing original
 * (`.veil` + `.drawer`), montado una sola vez en el layout.
 * No recibe props: lee todo del contexto del carrito.
 */
export function CartDrawer() {
  const { abierto, cerrar, subtotal, detalle } = useCarrito();
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const focoAnterior = useRef<HTMLElement | null>(null);
  const vacio = detalle.length === 0;

  // Escape cierra el pedido y el foco no se escapa del drawer.
  useEffect(() => {
    if (!abierto) return;

    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        cerrar();
        return;
      }
      if (evento.key !== "Tab") return;

      const raiz = panel.current;
      if (!raiz) return;
      const focalizables = Array.from(
        raiz.querySelectorAll<HTMLElement>(FOCALIZABLES),
      ).filter(
        (elemento) =>
          elemento.offsetWidth > 0 || elemento.offsetHeight > 0,
      );
      if (focalizables.length === 0) {
        evento.preventDefault();
        return;
      }

      const primero = focalizables[0];
      const ultimo = focalizables[focalizables.length - 1];
      const activo = document.activeElement;
      if (evento.shiftKey && (activo === primero || !raiz.contains(activo))) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && activo === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", alPresionarTecla);
    return () => document.removeEventListener("keydown", alPresionarTecla);
  }, [abierto, cerrar]);

  // Al abrir el foco entra al panel; al cerrar vuelve a quien lo abrió.
  useEffect(() => {
    if (abierto) {
      focoAnterior.current = document.activeElement as HTMLElement | null;
      const temporizador = window.setTimeout(() => {
        botonCerrar.current?.focus();
      }, 0);
      return () => window.clearTimeout(temporizador);
    }

    const destino = focoAnterior.current;
    focoAnterior.current = null;
    if (destino && document.contains(destino)) {
      destino.focus({ preventScroll: true });
    }
    return undefined;
  }, [abierto]);

  return (
    <>
      <div
        className={`veil${abierto ? " on" : ""}`}
        onClick={cerrar}
        aria-hidden="true"
      />
      <aside
        ref={panel}
        className={`drawer${abierto ? " on" : ""}`}
        role="dialog"
        aria-label="Mi pedido"
        aria-modal={abierto ? true : undefined}
        aria-hidden={!abierto}
        inert={!abierto}
      >
        <div className="dh">
          <h2>MI PEDIDO</h2>
          <button
            type="button"
            className="x"
            onClick={cerrar}
            aria-label="Cerrar pedido"
            ref={botonCerrar}
          >
            ×
          </button>
        </div>

        <div className="db">
          {vacio ? (
            <p className="empty">
              Tu pedido está vacío.
              <br />
              Elige un planeta y agrega tu primera hamburguesa.
            </p>
          ) : (
            <CartLines />
          )}
        </div>

        {!vacio && (
          <div className="df">
            <div className="total" aria-live="polite">
              <span>TOTAL</span>
              <span>{formatearMoneda(subtotal)}</span>
            </div>
            <CheckoutForm compacta />
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
