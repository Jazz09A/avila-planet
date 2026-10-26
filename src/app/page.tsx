import type { CSSProperties } from "react";
import Link from "next/link";
import AgregarButton from "@/components/AgregarButton";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PlanetOrb from "@/components/PlanetOrb";
import PlanetTour from "@/components/PlanetTour";
import { BURGUERSAS } from "@/lib/catalog";
import { formatearMoneda } from "@/lib/money";

/**
 * Home de Ávila Planet: portada, tour de planetas, adelanto del menú,
 * pasos para pedir y cierre con la llamada a la acción.
 *
 * Server component: sólo PlanetTour necesita interactividad en el cliente.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <PlanetTour />

      <section id="menu">
        <div className="wrap">
          <h2 className="title">Menú completo</h2>
          <p className="sub">Todo lo que viaja en la nave, listo para pedir.</p>
          <div className="grid">
            {BURGUERSAS.map((producto, i) => (
              <article
                className="item"
                key={producto.id}
                style={{ "--i": String(i) } as CSSProperties}
              >
                <PlanetOrb producto={producto} tamano="sm" />
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
            <h2 className="title">¿Listo para despegar?</h2>
            <p className="desc">
              Arma tu pedido con los seis planetas, acompañantes y bebidas.
              Cocinamos al momento y entre 15 y 30 minutos estás en órbita.
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
