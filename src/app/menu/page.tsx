import type { Metadata } from "next";
import Link from "next/link";
import HowItWorks from "@/components/HowItWorks";
import MenuTabs from "@/components/MenuTabs";
import { CATEGORIAS, PRODUCTOS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Menú · Ávila Planet",
  description:
    "Seis planetas, tres acompañantes y tres bebidas. Explora el menú completo de Ávila Planet y arma tu pedido.",
};

export default function MenuPage() {
  return (
    <>
      <section id="menu">
        <div className="wrap">
          {/* Cabecera de página */}
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
            <div className="max-w-xl">
              <p className="tag">Ávila Planet</p>
              <h1 className="title">El menú</h1>
              <p className="text-dim">
                Seis planetas, tres acompañantes y tres bebidas. Todo listo para
                pedir.
              </p>
              <p className="mt-3 text-sm text-dim">
                {PRODUCTOS.length} productos · {CATEGORIAS.length} categorías
              </p>
            </div>
            <Link
              href="/"
              className="btn-sm inline-flex items-center gap-2 no-underline"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
              Volver al inicio
            </Link>
          </div>

          <h2 className="title">Menú completo</h2>
          <p className="sub">Todo lo que viaja en la nave, listo para pedir.</p>

          <MenuTabs />
        </div>
      </section>

      {/* Pasos para pedir: reutiliza la sección compartida de la portada. */}
      <HowItWorks />
    </>
  );
}
