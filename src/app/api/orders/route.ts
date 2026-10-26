import { pinAdminValido } from "@/lib/admin";
import { errorJson } from "@/lib/http";
import { obtenerProducto } from "@/lib/catalog";
import { crearPedido, listarPedidos } from "@/lib/orders";
import type { LineaPedido } from "@/lib/types";
import { esquemaCrearPedido, mensajeDeError } from "@/lib/validation";

export const dynamic = "force-dynamic";

/**
 * Minutos estimados por modo de entrega:
 * recoger 15-25 min (20) y domicilio 25-40 min (32).
 */
const MINUTOS_POR_MODO = {
  recoger: 20,
  domicilio: 32,
} as const;

/** Crea un pedido. Público: los precios siempre se recalculan en el servidor. */
export async function POST(request: Request): Promise<Response> {
  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return errorJson("El cuerpo de la petición debe ser JSON válido.", 400);
  }

  const validado = esquemaCrearPedido.safeParse(cuerpo);
  if (!validado.success) {
    return errorJson(mensajeDeError(validado.error), 400);
  }

  const datos = validado.data;

  // Snapshot del catálogo: el precio del cliente se ignora por completo.
  const items: LineaPedido[] = [];
  for (const item of datos.items) {
    const producto = obtenerProducto(item.id);
    if (!producto) {
      return errorJson(`Producto no encontrado: ${item.id}`, 404);
    }
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precioUnitario: producto.precio,
      cantidad: item.cantidad,
    });
  }

  const subtotal = items.reduce(
    (suma, linea) => suma + linea.precioUnitario * linea.cantidad,
    0,
  );
  const minutosEstimados = MINUTOS_POR_MODO[datos.modo];

  try {
    const pedido = await crearPedido({
      modo: datos.modo,
      metodoPago: datos.metodoPago,
      cliente: {
        nombre: datos.nombre,
        telefono: datos.telefono,
        ...(datos.direccion ? { direccion: datos.direccion } : {}),
      },
      items,
      subtotal,
      total: subtotal,
      minutosEstimados,
    });

    return Response.json(
      {
        codigo: pedido.codigo,
        pedido,
        estimadoMinutos: pedido.minutosEstimados,
      },
      { status: 201 },
    );
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : "No se pudo guardar el pedido.";
    return errorJson(mensaje, 500);
  }
}

/** Lista los pedidos. Solo panel de cocina: exige el PIN de administrador. */
export async function GET(request: Request): Promise<Response> {
  const pin = request.headers.get("x-admin-pin");
  if (!pinAdminValido(pin)) {
    return errorJson("PIN inválido", 401);
  }

  const pedidos = await listarPedidos();
  return Response.json({ pedidos });
}
