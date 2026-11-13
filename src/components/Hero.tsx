import type { CSSProperties } from "react";
import Link from "next/link";
import BrasaOrb from "@/components/BrasaOrb";
import { obtenerProducto } from "@/lib/catalog";

/**
 * Portada de la home (id="inicio").
 *
 * Server component: no necesita estado ni efectos. El orbe decorativo usa el
 * producto "costillas" del catálogo y el CSS de `.herobrasa .orb` ya anima el
 * pulso y el flotado.
 */
export function Hero() {
  const costillas = obtenerProducto("costillas");

  return (
    <section className="hero" id="inicio">
      <div className="wrap">
        <h1>
          <span>ALGO</span>
          <span>DIFERENTE</span>
        </h1>
        <p>
          Bienvenido a Algo Diferente: parrillas, hamburguesas y pepitos al
          carbón. Elige lo que quieras, agrega al pedido y recíbelo en minutos.
        </p>
        <div className="cta">
          <a className="btn fill" href="#especiales">
            Ver especialidades
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

      <div className="herobrasa" aria-hidden="true">
        {costillas ? (
          <BrasaOrb
            producto={costillas}
            style={{ "--s": "min(400px,34vw)" } as CSSProperties}
          />
        ) : null}
      </div>

      <div className="horizon" aria-hidden="true"></div>
    </section>
  );
}

export default Hero;
