import { z } from "zod";

/**
 * Esquemas de validación del API de pedidos (zod v4).
 * Todos los mensajes están en español porque se exponen al usuario final.
 */

export const esquemaCrearPedido = z
  .object({
    modo: z.enum(["recoger", "domicilio"], {
      error: "El modo de entrega debe ser «recoger» o «domicilio».",
    }),
    metodoPago: z.enum(["efectivo", "transferencia", "contra_entrega"], {
      error: "El método de pago no es válido.",
    }),
    nombre: z
      .string({ error: "El nombre es obligatorio." })
      .trim()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
      .max(80, { error: "El nombre no puede superar los 80 caracteres." }),
    telefono: z
      .string({ error: "El teléfono es obligatorio." })
      .trim()
      .min(7, { error: "El teléfono debe tener al menos 7 caracteres." })
      .max(20, { error: "El teléfono no puede superar los 20 caracteres." }),
    direccion: z
      .string({ error: "La dirección debe ser un texto." })
      .trim()
      .max(200, { error: "La dirección no puede superar los 200 caracteres." })
      .optional(),
    items: z
      .array(
        z.object({
          id: z.string({ error: "El identificador del producto es obligatorio." }),
          cantidad: z
            .number({ error: "La cantidad debe ser un número." })
            .int({ error: "La cantidad debe ser un número entero." })
            .min(1, { error: "La cantidad mínima es 1." })
            .max(50, { error: "La cantidad máxima es 50." }),
        }),
      )
      .min(1, { error: "El pedido debe incluir al menos un producto." }),
  })
  .superRefine((datos, ctx) => {
    if (datos.modo === "domicilio" && !datos.direccion) {
      ctx.addIssue({
        code: "custom",
        path: ["direccion"],
        message: "La dirección de entrega es obligatoria para pedidos a domicilio.",
      });
    }
    if (datos.modo === "recoger" && datos.metodoPago === "contra_entrega") {
      ctx.addIssue({
        code: "custom",
        path: ["metodoPago"],
        message:
          "El pago contra entrega solo está disponible para pedidos a domicilio.",
      });
    }
  });

export const esquemaEstadoPedido = z.object({
  estado: z.enum(
    ["recibido", "preparando", "listo", "entregado", "cancelado"],
    { error: "El estado del pedido no es válido." },
  ),
});

/** Convierte la ruta de un issue en algo legible: `items[0].cantidad`. */
function rutaLegible(path: readonly PropertyKey[]): string {
  if (path.length === 0) return "pedido";
  return path
    .map((parte, indice) => {
      if (typeof parte === "number") return `[${parte}]`;
      return indice === 0 ? String(parte) : `.${String(parte)}`;
    })
    .join("");
}

/** Arma un texto en español con todos los problemas de validación. */
export function mensajeDeError(error: z.ZodError): string {
  const detalles = error.issues.map(
    (issue) => `${rutaLegible(issue.path)}: ${issue.message}`,
  );
  if (detalles.length === 0) return "Los datos del pedido no son válidos.";
  return `Datos del pedido no válidos. ${detalles.join(" ")}`;
}
