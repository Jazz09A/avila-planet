import type { CSSProperties } from "react";
import Link from "next/link";
import PlanetOrb from "@/components/PlanetOrb";
import { obtenerProducto } from "@/lib/catalog";

/**
 * Portada de la home (id="inicio").
 *
 * Server component: no necesita estado ni efectos. El orbe decorativo usa el
 * producto "tierra" del catálogo y el CSS de `.heroplanet .orb` ya anima el
 * pulso y el flotado.
 */
export function Hero() {
  const tierra = obtenerProducto("tierra");

  return (
    <section className="hero" id="inicio">
      <div className="wrap">
        <h1>
          <span>EXPLORA</span>
          <span>EL SABOR</span>
        </h1>
        <p>
          Bienvenido a Ávila Planet: seis hamburguesas, seis planetas. Elige tu
          destino, agrega al pedido y recíbelo en minutos.
        </p>
        <div className="cta">
          <a className="btn fill" href="#planetas">
            Empezar viaje
          </a>
          <Link className="plus" href="/menu" aria-label="Ver menú completo">
            +
          </Link>
        </div>
      </div>

      <div className="scroll" aria-hidden="true">
        <span>01</span>
        <i></i>
        <span>03</span>
      </div>

      <div className="heroplanet" aria-hidden="true">
        {tierra ? (
          <PlanetOrb
            producto={tierra}
            style={{ "--s": "min(400px,34vw)" } as CSSProperties}
          />
        ) : null}
      </div>

      <div className="horizon" aria-hidden="true"></div>
    </section>
  );
}

export default Hero;
