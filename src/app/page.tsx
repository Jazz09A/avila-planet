import type { CSSProperties } from "react";
import Link from "next/link";
import AgregarButton from "@/components/AgregarButton";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import BrasaOrb from "@/components/BrasaOrb";
import EspecialTour from "@/components/EspecialTour";
import { DESTACADOS } from "@/lib/catalog";
import { formatearMoneda } from "@/lib/money";

/**
 * Home de Algo Diferente: portada, tour de especialidades, adelanto del
 * menú, pasos para pedir y cierre con la llamada a la acción.
 *
 * Server component: sólo EspecialTour necesita interactividad en el cliente.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <EspecialTour />

      <section id="menu">
        <div className="wrap">
          <h2 className="title">Menú completo</h2>
          <p className="sub">Todo sale de las brasas, listo para pedir.</p>
          <div className="grid">
            {DESTACADOS.slice(0, 6).map((producto, i) => (
              <article
                className="item"
                key={producto.id}
                style={{ "--i": String(i) } as CSSProperties}
              >
                <BrasaOrb producto={producto} tamano="sm" />
                <div>
                  <h3>{producto.nombre.toUpperCase()}</h3>
                  <p>{producto.descripcion}</p>
                  <div className="row">
                    <strong>{formatearMoneda(producto.precio)}</strong>
                    <AgregarButton id={producto.id} className="add">
                      Agregar
                    </AgregarButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="cta mt-10">
            <Link className="btn" href="/menu">
              Ver menú completo
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section>
        <div className="wrap">
          <div className="card p-8">
            <h2 className="title">¿Se antoja algo?</h2>
            <p className="desc">
              Arma tu pedido con parrillas, hamburguesas y pepitos.
              Cocinamos al momento y en 15 a 30 minutos está en tu mesa.
            </p>
            <div className="cta">
              <Link className="btn fill" href="/menu">
                Armar mi pedido
              </Link>
              <Link
                className="btn-sm inline-flex items-center"
                href="/admin"
              >
                Cocina
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
