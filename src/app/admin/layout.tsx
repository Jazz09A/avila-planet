import type { Metadata } from "next";

/**
 * `/admin` es una página cliente y no puede exportar metadata por sí misma,
 * así que el título propio vive en este layout.
 */
export const metadata: Metadata = {
  title: "Panel de cocina · Algo Diferente",
  description:
    "Pedidos en vivo de Algo Diferente: consulta los pedidos entrantes y actualiza su estado.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
