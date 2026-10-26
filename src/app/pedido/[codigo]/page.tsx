import type { Metadata } from "next";
import Link from "next/link";
import EstadoPedido from "@/components/EstadoPedido";
import { PlanetOrb } from "@/components/PlanetOrb";
import { obtenerProducto } from "@/lib/catalog";
import { formatearMoneda } from "@/lib/money";
import { obtenerPedido } from "@/lib/orders";
import { ETIQUETAS_MODO, ETIQUETAS_PAGO } from "@/lib/types";

/** El pedido se lee siempre en runtime: el estado cambia en el servidor. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tu pedido · Ávila Planet",
  description: "Sigue el estado de tu pedido en órbita.",
};

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-[color:var(--dim)]">
        {etiqueta}
      </div>
      <div className="mt-1 font-display text-[15px] tracking-[0.04em]">
        {valor}
      </div>
    </div>
  );
}

export default async function PaginaPedido({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const pedido = await obtenerPedido(codigo);

  if (!pedido) {
    return (
      <section>
        <div className="wrap">
          <div className="done">
            <h2>PEDIDO NO ENCONTRADO</h2>
            <p>
              El código {codigo} no corresponde a ningún pedido. Revisa el
              enlace o haz un pedido nuevo.
            </p>
            <Link href="/" className="btn">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const primerNombre = pedido.cliente.nombre.trim().split(/\s+/)[0] || "piloto";
  const planeta =
    obtenerProducto("tierra") ?? obtenerProducto(pedido.items[0]?.id ?? "");

  return (
    <section>
      <div className="wrap">
        <div className="done">
          {planeta && <PlanetOrb producto={planeta} />}
          <h2>PEDIDO EN ÓRBITA</h2>
          <p>
            Gracias, {primerNombre}. Tu pedido {pedido.codigo} por{" "}
            {formatearMoneda(pedido.total)} ya está en cocina.
            <br />
            {pedido.modo === "domicilio"
              ? `Llega en ${pedido.minutosEstimados} minutos.`
              : `Estará listo para recoger en ${pedido.minutosEstimados} minutos.`}
          </p>
          <EstadoPedido codigo={codigo} estadoInicial={pedido.estado} />
        </div>

        <div className="card mx-auto max-w-3xl p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Dato etiqueta="Entrega" valor={ETIQUETAS_MODO[pedido.modo]} />
            <Dato etiqueta="Pago" valor={ETIQUETAS_PAGO[pedido.metodoPago]} />
            <Dato
              etiqueta="Tiempo estimado"
              valor={`${pedido.minutosEstimados} min`}
            />
            <Dato etiqueta="Total" valor={formatearMoneda(pedido.total)} />
          </div>

          {pedido.cliente.direccion && (
            <p className="mt-6 mb-0 text-sm text-[color:var(--dim)]">
              {pedido.cliente.nombre} · {pedido.cliente.telefono} ·{" "}
              {pedido.cliente.direccion}
            </p>
          )}

          <h3 className="mt-8 mb-3 font-display text-[15px] uppercase tracking-[0.12em]">
            Tu pedido
          </h3>
          <ul className="m-0 list-none p-0">
            {pedido.items.map((item) => {
              const producto = obtenerProducto(item.id);
              return (
                <li className="line" key={item.id}>
                  {producto ? (
                    <PlanetOrb producto={producto} tamano="sm" />
                  ) : (
                    <div className="orb sm" aria-hidden="true" />
                  )}
                  <div>
                    <h4>{item.nombre}</h4>
                    <small>{formatearMoneda(item.precioUnitario)} c/u</small>
                  </div>
                  <div className="qty">
                    <span>{item.cantidad} ×</span>
                    <span>
                      {formatearMoneda(item.precioUnitario * item.cantidad)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="total mt-4">
            <span>TOTAL</span>
            <span>{formatearMoneda(pedido.total)}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/menu" className="btn">
              Hacer otro pedido
            </Link>
            <Link href="/" className="btn-sm">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
