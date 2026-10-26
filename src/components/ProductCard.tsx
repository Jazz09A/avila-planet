"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { AgregarButton } from "./AgregarButton";
import { PlanetOrb } from "./PlanetOrb";
import { formatearMoneda } from "@/lib/money";
import type { Producto } from "@/lib/types";

interface Props {
  producto: Producto;
  /** Posición dentro de la rejilla: escalona la animación `rise` del CSS. */
  indice?: number;
}

/**
 * Tarjeta de producto del menú.
 * Reproduce el `<article class="item">` de la landing original: orbe del
 * planeta, nombre en mayúsculas, descripción, precio y botón "Agregar".
 */
export function ProductCard({ producto, indice = 0 }: Props) {
  const tarjeta = useRef<HTMLElement>(null);

  // El resplandor violeta de la tarjeta sigue al cursor (--mx / --my),
  // igual que en la landing original.
  useEffect(() => {
    const elemento = tarjeta.current;
    if (!elemento) return;

    const seguirCursor = (evento: PointerEvent) => {
      const rect = elemento.getBoundingClientRect();
      elemento.style.setProperty("--mx", `${evento.clientX - rect.left}px`);
      elemento.style.setProperty("--my", `${evento.clientY - rect.top}px`);
    };

    elemento.addEventListener("pointermove", seguirCursor);
    return () => elemento.removeEventListener("pointermove", seguirCursor);
  }, []);

  const estilo = { "--i": indice } as CSSProperties;

  return (
    <article className="item" style={estilo} ref={tarjeta}>
      <PlanetOrb producto={producto} tamano="sm" />
      <div>
        <h3>{producto.nombre.toUpperCase()}</h3>
        <p>{producto.descripcion}</p>
        <div className="row flex-wrap">
          <strong>{formatearMoneda(producto.precio)}</strong>
          <AgregarButton id={producto.id} className="add">
            Agregar
          </AgregarButton>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
