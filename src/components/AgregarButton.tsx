"use client";

import type { MouseEvent, ReactNode } from "react";
import { useCarrito } from "@/lib/cart";
import { dispararChispa } from "@/lib/spark";

interface Props {
  id: string;
  children?: ReactNode;
  /** Clase CSS del botón. Por defecto usa `.add` del diseño original. */
  className?: string;
  onAgregado?: () => void;
}

/**
 * Botón de "agregar al pedido" con la chispa volando al carrito.
 * Lo usan el tour de planetas, el catálogo y la página de carrito.
 */
export function AgregarButton({
  id,
  children = "Agregar",
  className = "add",
  onAgregado,
}: Props) {
  const { agregar } = useCarrito();

  function manejar(evento: MouseEvent<HTMLButtonElement>) {
    agregar(id);
    dispararChispa(evento.currentTarget);
    onAgregado?.();
  }

  return (
    <button type="button" className={className} onClick={manejar} data-add={id}>
      {children}
    </button>
  );
}

export default AgregarButton;
