import { pinAdminValido } from "@/lib/admin";
import { errorJson } from "@/lib/http";
import { actualizarEstado, obtenerPedido } from "@/lib/orders";
import { esquemaEstadoPedido, mensajeDeError } from "@/lib/validation";

export const dynamic = "force-dynamic";

/** Tracking público del pedido. Acepta `OB-1234` y `1234`. */
export async function GET(
  request: Request,
  context: { params: Promise<{ codigo: string }> },
): Promise<Response> {
  const { codigo } = await context.params;
  const pedido = await obtenerPedido(codigo);

  if (!pedido) {
    return errorJson("Pedido no encontrado", 404);
  }

  return Response.json({ pedido });
}

/** Cambia el estado del pedido. Solo panel de cocina: exige el PIN de administrador. */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ codigo: string }> },
): Promise<Response> {
  const pin = request.headers.get("x-admin-pin");
  if (!pinAdminValido(pin)) {
    return errorJson("PIN inválido", 401);
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return errorJson("El cuerpo de la petición debe ser JSON válido.", 400);
  }

  const validado = esquemaEstadoPedido.safeParse(cuerpo);
  if (!validado.success) {
    return errorJson(mensajeDeError(validado.error), 400);
  }

  const { codigo } = await context.params;
  const pedido = await actualizarEstado(codigo, validado.data.estado);
  if (!pedido) {
    return errorJson("Pedido no encontrado", 404);
  }

  return Response.json({ pedido });
}
