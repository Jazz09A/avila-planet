/**
 * Acceso al panel de cocina. El PIN viaja en la cabecera `x-admin-pin`.
 * Demo local: comparación simple y sin trazas ni mensajes que filtren el PIN.
 */

export const PIN_POR_DEFECTO = "1234";

/** Comprueba el PIN recibido contra `ADMIN_PIN` (o el PIN por defecto). */
export function pinAdminValido(pin: string | null | undefined): boolean {
  if (typeof pin !== "string") return false;
  const recibido = pin.trim();
  if (recibido.length === 0) return false;

  const esperado = (process.env.ADMIN_PIN ?? PIN_POR_DEFECTO).trim();
  if (esperado.length === 0) return false;

  return recibido === esperado;
}
