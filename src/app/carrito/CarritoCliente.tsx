"use client";

import Link from "next/link";
import CartLines from "@/components/CartLines";
import CheckoutForm from "@/components/CheckoutForm";
import { useCarrito, useHidratado } from "@/lib/cart";
import { formatearMoneda } from "@/lib/money";

/**
 * Isla cliente de la página de carrito: el carrito vive en localStorage,
 * así que el contenido real solo existe en el navegador.
 */
export function CarritoCliente() {
  const { detalle, subtotal, cantidadTotal } = useCarrito();
  const hidratado = useHidratado();

  if (!hidratado) {
    return <p className="empty">Cargando tu pedido…</p>;
  }

  if (detalle.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="empty">
          Tu pedido está vacío.
          <br />
          Elige un planeta y agrega tu primera hamburguesa.
        </p>
        <Link href="/menu" className="btn">
          Ver menú completo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="card p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="m-0 font-display text-[15px] uppercase tracking-[0.12em]">
            {cantidadTotal} {cantidadTotal === 1 ? "producto" : "productos"}
          </h3>
          <span className="text-sm text-[color:var(--dim)]">En tu pedido</span>
        </div>
        <CartLines />
      </div>

      <div className="card p-6">
        <div className="total" aria-live="polite">
          <span>TOTAL</span>
          <span>{formatearMoneda(subtotal)}</span>
        </div>
        <CheckoutForm />
      </div>
    </div>
  );
}

export default CarritoCliente;
