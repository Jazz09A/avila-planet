export type Categoria = "hamburguesas" | "acompanantes" | "bebidas";

export interface Producto {
  id: string;
  nombre: string;
  categoria: Categoria;
  precio: number;
  descripcion: string;
  /** Subtítulo del tipo "La clásica" que aparece en el tour de planetas. */
  etiqueta?: string;
  /** Etiquetas del tour: peso, picor y tiempo de preparación. */
  stats?: [string, string, string];
  /** Tres paradas del gradiente radial del orbe (planeta). */
  colores: [string, string, string];
  /** Color del resplandor exterior del orbe. */
  glow: string;
  /** Añade el anillo orbital alrededor del planeta. */
  anillo?: boolean;
  /** Textura CSS opcional (nubes, cráteres, bandas). */
  textura?: string;
}

export type ModoEntrega = "recoger" | "domicilio";

export type MetodoPago = "efectivo" | "transferencia" | "contra_entrega";

export type EstadoPedido =
  | "recibido"
  | "preparando"
  | "listo"
  | "entregado"
  | "cancelado";

export interface LineaPedido {
  id: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Cliente {
  nombre: string;
  telefono: string;
  direccion?: string;
}

export interface Pedido {
  codigo: string;
  creadoEn: string;
  actualizadoEn: string;
  estado: EstadoPedido;
  modo: ModoEntrega;
  metodoPago: MetodoPago;
  cliente: Cliente;
  items: LineaPedido[];
  subtotal: number;
  total: number;
  minutosEstimados: number;
}

export const ETIQUETAS_ESTADO: Record<EstadoPedido, string> = {
  recibido: "Recibido",
  preparando: "En preparación",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const ETIQUETAS_MODO: Record<ModoEntrega, string> = {
  recoger: "Recoger en tienda",
  domicilio: "A domicilio",
};

export const ETIQUETAS_PAGO: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  contra_entrega: "Pago contra entrega",
};

/** Siguiente estado válido en el ciclo de vida de un pedido. */
export const FLUJO_ESTADOS: EstadoPedido[] = [
  "recibido",
  "preparando",
  "listo",
  "entregado",
];

export function siguienteEstado(estado: EstadoPedido): EstadoPedido | null {
  const i = FLUJO_ESTADOS.indexOf(estado);
  if (i === -1 || i === FLUJO_ESTADOS.length - 1) return null;
  return FLUJO_ESTADOS[i + 1];
}
