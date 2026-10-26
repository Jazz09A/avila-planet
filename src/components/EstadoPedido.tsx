"use client";

import { useEffect, useRef, useState } from "react";
import { ETIQUETAS_ESTADO, type EstadoPedido as EstadoPedidoTipo } from "@/lib/types";

interface Props {
  codigo: string;
  estadoInicial: EstadoPedidoTipo;
}

interface RespuestaPedido {
  pedido?: { estado?: string };
}

/** Estados terminales: ya no tiene sentido seguir preguntando. */
const ESTADOS_FINALES: EstadoPedidoTipo[] = ["entregado", "cancelado"];

/**
 * Distintivo del estado del pedido. Se refresca cada 5 s contra
 * `GET /api/orders/[codigo]`; si el refresco falla conserva el
 * último estado conocido en lugar de romper la vista.
 */
export function EstadoPedido({ codigo, estadoInicial }: Props) {
  const [estado, setEstado] = useState<EstadoPedidoTipo>(estadoInicial);
  const estadoActual = useRef<EstadoPedidoTipo>(estadoInicial);

  useEffect(() => {
    estadoActual.current = estado;
  }, [estado]);

  useEffect(() => {
    let vigente = true;

    async function consultar() {
      if (ESTADOS_FINALES.includes(estadoActual.current)) return;
      try {
        const respuesta = await fetch(`/api/orders/${codigo}`, {
          cache: "no-store",
        });
        if (!respuesta.ok) return;
        const datos = (await respuesta.json().catch(() => null)) as
          | RespuestaPedido
          | null;
        const siguiente = datos?.pedido?.estado;
        if (!vigente || typeof siguiente !== "string") return;
        if (!Object.prototype.hasOwnProperty.call(ETIQUETAS_ESTADO, siguiente)) {
          return;
        }
        setEstado(siguiente as EstadoPedidoTipo);
      } catch {
        // Sin conexión: se conserva el último estado conocido.
      }
    }

    void consultar();
    const intervalo = window.setInterval(consultar, 5000);
    return () => {
      vigente = false;
      window.clearInterval(intervalo);
    };
  }, [codigo]);

  return (
    <span className={`badge badge-${estado}`} aria-live="polite">
      {ETIQUETAS_ESTADO[estado]}
    </span>
  );
}

export default EstadoPedido;
