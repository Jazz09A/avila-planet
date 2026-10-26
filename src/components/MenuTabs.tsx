"use client";

import { useMemo, useState } from "react";
import { CATEGORIAS, productosPorCategoria } from "@/lib/catalog";
import type { Categoria } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const CATEGORIA_INICIAL: Categoria = "hamburguesas";

/**
 * Pestañas de categoría + rejilla de productos.
 * Reproduce `#tabs` y `#grid` de la landing original y añade un filtro
 * opcional por nombre o descripción dentro de la categoría activa.
 */
export function MenuTabs() {
  const [categoria, setCategoria] = useState<Categoria>(CATEGORIA_INICIAL);
  const [consulta, setConsulta] = useState("");

  const visibles = useMemo(() => {
    const texto = consulta.trim().toLowerCase();
    return productosPorCategoria(categoria).filter(
      (producto) =>
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto),
    );
  }, [categoria, consulta]);

  const nombreCategoria =
    CATEGORIAS.find((opcion) => opcion.id === categoria)?.nombre ?? "";

  return (
    <>
      <div className="tabs" role="group" aria-label="Categorías del menú">
        {CATEGORIAS.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            aria-pressed={categoria === opcion.id}
            onClick={() => setCategoria(opcion.id)}
          >
            {opcion.nombre}
          </button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-dim" aria-live="polite">
          {visibles.length === 1
            ? "1 producto"
            : `${visibles.length} productos`}
        </p>

        <div className="flex w-full items-center gap-2 sm:w-80">
          <div className="flex-1">
            <label htmlFor="busqueda-menu" className="sr-only">
              Buscar en el menú
            </label>
            <input
              id="busqueda-menu"
              type="text"
              placeholder="Buscar en el menú"
              value={consulta}
              onChange={(evento) => setConsulta(evento.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn-sm inline-flex shrink-0 items-center"
            onClick={() => setConsulta("")}
            disabled={consulta.length === 0}
            aria-label="Limpiar búsqueda"
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {visibles.length > 0 ? (
        <div className="grid">
          {visibles.map((producto, indice) => (
            <ProductCard
              key={`${categoria}-${producto.id}`}
              producto={producto}
              indice={indice}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p className="mb-4">
            No hay productos que coincidan con “{consulta}” en {nombreCategoria}.
          </p>
          <button
            type="button"
            className="btn-sm"
            onClick={() => setConsulta("")}
          >
            Quitar filtro
          </button>
        </div>
      )}
    </>
  );
}

export default MenuTabs;
