"use client";

import { obtenerProducto } from "./catalog";

/**
 * Store externo del carrito.
 *
 * Vive fuera de React y se expone con `useSyncExternalStore`, así el servidor
 * siempre renderiza el carrito vacío y el cliente lo hidrata sin `setState`
 * dentro de efectos (y sin destello de "carrito vacío").
 */

export interface LineaCarrito {
  id: string;
  cantidad: number;
}

const CLAVE_ALMACEN = "avila-planet:carrito:v1";
const VACIO: LineaCarrito[] = [];

let cache: LineaCarrito[] | null = null;
const suscriptores = new Set<() => void>();

/** Descarta líneas inválidas (el almacenamiento es editable a mano). */
function normalizar(bruto: unknown): LineaCarrito[] {
  if (!Array.isArray(bruto)) return [];
  const lineas: LineaCarrito[] = [];
  for (const item of bruto) {
    if (typeof item !== "object" || item === null) continue;
    const id = (item as { id?: unknown }).id;
    const cantidad = (item as { cantidad?: unknown }).cantidad;
    if (typeof id !== "string" || !obtenerProducto(id)) continue;
    if (typeof cantidad !== "number" || !Number.isFinite(cantidad) || cantidad <= 0) {
      continue;
    }
    lineas.push({ id, cantidad: Math.floor(cantidad) });
  }
  return lineas;
}

function leerDelAlmacenamiento(): LineaCarrito[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_ALMACEN);
    if (!crudo) return [];
    return normalizar(JSON.parse(crudo));
  } catch {
    // Almacenamiento no disponible o corrupto: carrito vacío.
    return [];
  }
}

/** Instantánea del cliente. Cacheada para que la referencia sea estable. */
export function instantanea(): LineaCarrito[] {
  if (cache === null) cache = leerDelAlmacenamiento();
  return cache;
}

/** Instantánea del servidor: siempre vacío. */
export function instantaneaServidor(): LineaCarrito[] {
  return VACIO;
}

export function suscribir(callback: () => void): () => void {
  suscriptores.add(callback);
  const alCambiarEnOtraPestana = () => {
    cache = null;
    for (const avisar of suscriptores) avisar();
  };
  window.addEventListener("storage", alCambiarEnOtraPestana);
  return () => {
    suscriptores.delete(callback);
    window.removeEventListener("storage", alCambiarEnOtraPestana);
  };
}

/** Guarda el carrito y avisa a todos los suscriptores. */
export function guardar(lineas: LineaCarrito[]): void {
  cache = lineas;
  try {
    window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lineas));
  } catch {
    // Modo privado o cuota llena: el carrito sigue funcionando en memoria.
  }
  for (const avisar of suscriptores) avisar();
}
