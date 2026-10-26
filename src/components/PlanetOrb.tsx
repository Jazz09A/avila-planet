import type { CSSProperties } from "react";
import type { Producto } from "@/lib/types";

interface Props {
  producto: Producto;
  /** `sm` para miniaturas de tarjeta y del carrito, `md` para el tamaño por defecto. */
  tamano?: "sm" | "md";
  className?: string;
  style?: CSSProperties;
}

/**
 * Orbe/planeta: la pieza visual central de Ávila Planet.
 * Todo se resuelve con variables CSS (`--c1`, `--c2`, `--c3`, `--glow`, `--tex`).
 */
export function PlanetOrb({
  producto,
  tamano = "md",
  className = "",
  style,
}: Props) {
  const variables = {
    "--c1": producto.colores[0],
    "--c2": producto.colores[1],
    "--c3": producto.colores[2],
    "--glow": producto.glow,
    ...(producto.textura ? { "--tex": producto.textura } : {}),
  } as CSSProperties;

  const clases = ["orb", tamano === "sm" ? "sm" : "", producto.anillo ? "ring" : "", className]
    .filter(Boolean)
    .join(" ");

  return <div className={clases} style={{ ...variables, ...style }} aria-hidden="true" />;
}

export default PlanetOrb;
