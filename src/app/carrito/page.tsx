import type { Metadata } from "next";
import Link from "next/link";
import CarritoCliente from "./CarritoCliente";

export const metadata: Metadata = {
  title: "Mi pedido · Ávila Planet",
  description: "Revisa tu pedido y confirma la entrega en Ávila Planet.",
};

export default function PaginaCarrito() {
  return (
    <section>
      <div className="wrap">
        <h2 className="title">Mi pedido</h2>
        <p className="sub">Revisa tu pedido antes de confirmar.</p>

        <CarritoCliente />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/menu" className="btn">
            Ver menú completo
          </Link>
          <Link href="/" className="btn-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
