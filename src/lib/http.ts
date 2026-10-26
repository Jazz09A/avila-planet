/** Respuesta JSON de error con el mismo formato en todas las rutas. */
export function errorJson(mensaje: string, estado: number): Response {
  return Response.json({ error: mensaje }, { status: estado });
}
