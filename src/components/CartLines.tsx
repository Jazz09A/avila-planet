"use client";

import PlanetOrb from "./PlanetOrb";
import { useCarrito } from "@/lib/cart";
import { formatearMoneda } from "@/lib/money";

/**
 * Líneas del carrito: el bloque `.line` de la landing original
 * (orbe, nombre, precio unitario y controles de cantidad).
 * Si el carrito está vacío no renderiza nada: el estado vacío
 * lo muestran el drawer y la página de carrito.
 */
export function CartLines() {
  const { detalle, establecer } = useCarrito();

  if (detalle.length === 0) return null;

  return (
    <>
      {detalle.map(({ producto, cantidad }) => (
        <div className="line" key={producto.id}>
          <PlanetOrb producto={producto} tamano="sm" />
          <div>
            <h4>{producto.nombre}</h4>
            <small>{formatearMoneda(producto.precio)} c/u</small>
          </div>
          <div className="qty">
            <button
              type="button"
              onClick={() => establecer(producto.id, cantidad - 1)}
              aria-label="Quitar uno"
            >
              −
            </button>
            <span aria-live="polite">{cantidad}</span>
            <button
              type="button"
              onClick={() => establecer(producto.id, cantidad + 1)}
              aria-label="Agregar uno"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default CartLines;
