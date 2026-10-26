/**
 * Formato de moneda determinista (sin Intl) para que el markup del servidor
 * y el del cliente coincidan siempre y no haya warnings de hidratación.
 */
export function formatearMoneda(valor: number): string {
  const entero = Math.round(valor);
  const negativo = entero < 0;
  const digitos = String(Math.abs(entero)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negativo ? "-" : ""}$${digitos}`;
}
