"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  guardar,
  instantanea,
  instantaneaServidor,
  suscribir,
  type LineaCarrito,
} from "./carrito-store";
import { obtenerProducto } from "./catalog";
import type { Producto } from "./types";

export type { LineaCarrito } from "./carrito-store";

export interface LineaCarritoDetalle {
  producto: Producto;
  cantidad: number;
}

interface ValorCarrito {
  lineas: LineaCarrito[];
  detalle: LineaCarritoDetalle[];
  cantidadTotal: number;
  subtotal: number;
  agregar: (id: string, cantidad?: number) => void;
  establecer: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const ContextoCarrito = createContext<ValorCarrito | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // `useSyncExternalStore` garantiza que el servidor pinta el carrito vacío
  // y el cliente lo hidrata desde localStorage sin desajuste de hidratación.
  const lineas = useSyncExternalStore(
    suscribir,
    instantanea,
    instantaneaServidor,
  );
  const [abierto, setAbierto] = useState(false);

  const agregar = useCallback(
    (id: string, cantidad = 1) => {
      const existente = lineas.find((linea) => linea.id === id);
      const nuevas = existente
        ? lineas.map((linea) =>
            linea.id === id
              ? { ...linea, cantidad: linea.cantidad + cantidad }
              : linea,
          )
        : [...lineas, { id, cantidad }];
      guardar(nuevas);
    },
    [lineas],
  );

  const establecer = useCallback(
    (id: string, cantidad: number) => {
      const nuevas =
        cantidad <= 0
          ? lineas.filter((linea) => linea.id !== id)
          : lineas.some((linea) => linea.id === id)
            ? lineas.map((linea) =>
                linea.id === id ? { ...linea, cantidad } : linea,
              )
            : [...lineas, { id, cantidad }];
      guardar(nuevas);
    },
    [lineas],
  );

  const quitar = useCallback(
    (id: string) => {
      guardar(lineas.filter((linea) => linea.id !== id));
    },
    [lineas],
  );

  const vaciar = useCallback(() => {
    guardar([]);
  }, []);

  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo<ValorCarrito>(() => {
    const detalle: LineaCarritoDetalle[] = [];
    for (const linea of lineas) {
      const producto = obtenerProducto(linea.id);
      if (producto) detalle.push({ producto, cantidad: linea.cantidad });
    }
    return {
      lineas,
      detalle,
      cantidadTotal: detalle.reduce((suma, l) => suma + l.cantidad, 0),
      subtotal: detalle.reduce(
        (suma, l) => suma + l.producto.precio * l.cantidad,
        0,
      ),
      agregar,
      establecer,
      quitar,
      vaciar,
      abierto,
      abrir,
      cerrar,
    };
  }, [lineas, agregar, establecer, quitar, vaciar, abierto, abrir, cerrar]);

  return (
    <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>
  );
}

export function useCarrito(): ValorCarrito {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CartProvider>");
  }
  return contexto;
}

/**
 * `false` durante el render del servidor y en el primer render del cliente,
 * `true` después de hidratar. Sirve para no mostrar "carrito vacío" antes de
 * tiempo (patrón canónico con `useSyncExternalStore`).
 */
export function useHidratado(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
