"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useHidratado } from "@/lib/cart";
import { formatearMoneda } from "@/lib/money";
import {
  ETIQUETAS_ESTADO,
  ETIQUETAS_MODO,
  ETIQUETAS_PAGO,
  siguienteEstado,
  type EstadoPedido,
  type Pedido,
} from "@/lib/types";

/**
 * Panel de cocina: administration de pedidos para el equipo de la demo.
 *
 * Página cliente con tres estados: gate de PIN, listado de pedidos en vivo
 * y vuelta al gate cuando la sesión caduca. El PIN viaja en la cabecera
 * `x-admin-pin` y se recuerda en `sessionStorage` durante la pestaña.
 */

const CLAVE_PIN = "avila-planet:pin";
const INTERVALO_REFRESCO = 5000;

/** La hora se formatea en el navegador: el servidor nunca la pinta. */
const FORMATO_HORA = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
});

/** Estados en los que el pedido ya no admite más cambios. */
const ESTADOS_FINALES: EstadoPedido[] = ["entregado", "cancelado"];

/** Texto del botón principal según el estado actual del pedido. */
const ETIQUETAS_ACCION: Record<EstadoPedido, string> = {
  recibido: "Preparar",
  preparando: "Marcar listo",
  listo: "Entregar",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

type Filtro = EstadoPedido | "todos";

const FILTROS: Array<{ id: Filtro; etiqueta: string }> = [
  { id: "todos", etiqueta: "Todos" },
  { id: "recibido", etiqueta: ETIQUETAS_ESTADO.recibido },
  { id: "preparando", etiqueta: ETIQUETAS_ESTADO.preparando },
  { id: "listo", etiqueta: ETIQUETAS_ESTADO.listo },
  { id: "entregado", etiqueta: ETIQUETAS_ESTADO.entregado },
  { id: "cancelado", etiqueta: ETIQUETAS_ESTADO.cancelado },
];

interface RespuestaListado {
  pedidos?: Pedido[];
}

interface RespuestaPedido {
  pedido?: Pedido;
  error?: string;
}

function horaDe(iso: string): string {
  const fecha = new Date(iso);
  return Number.isNaN(fecha.getTime()) ? "—" : FORMATO_HORA.format(fecha);
}

function esFinal(estado: EstadoPedido): boolean {
  return ESTADOS_FINALES.includes(estado);
}

/* ------------------------------------------------------------------ */
/* Tarjeta de pedido                                                  */
/* ------------------------------------------------------------------ */

interface TarjetaPedidoProps {
  pedido: Pedido;
  guardando: boolean;
  onCambiar: (codigo: string, estado: EstadoPedido) => void;
}

function TarjetaPedido({ pedido, guardando, onCambiar }: TarjetaPedidoProps) {
  const siguiente = siguienteEstado(pedido.estado);
  const bloqueado = guardando || esFinal(pedido.estado);

  return (
    <article
      className="card flex flex-col gap-4 p-5"
      aria-labelledby={`pedido-${pedido.codigo}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2
            id={`pedido-${pedido.codigo}`}
            className="m-0 font-display text-[17px] tracking-[0.08em]"
          >
            {pedido.codigo}
          </h2>
          <p className="mt-1 text-sm text-dim">
            {horaDe(pedido.creadoEn)} · {pedido.minutosEstimados} min est.
          </p>
        </div>
        <span className={`badge badge-${pedido.estado}`}>
          {ETIQUETAS_ESTADO[pedido.estado]}
        </span>
      </header>

      <div>
        <p className="m-0 font-display text-[15px]">{pedido.cliente.nombre}</p>
        <p className="mt-1 text-sm text-dim">
          <a
            href={`tel:${pedido.cliente.telefono}`}
            className="hover:text-star hover:underline"
          >
            {pedido.cliente.telefono}
          </a>
          {pedido.cliente.direccion ? ` · ${pedido.cliente.direccion}` : ""}
        </p>
      </div>

      <p className="m-0 text-xs uppercase tracking-[0.14em] text-dim">
        {ETIQUETAS_MODO[pedido.modo]} · {ETIQUETAS_PAGO[pedido.metodoPago]}
      </p>

      <ul className="m-0 list-none p-0">
        {pedido.items.map((item) => (
          <li className="line" key={item.id}>
            <span className="font-display text-[15px] text-dim">
              ×{item.cantidad}
            </span>
            <h3 className="m-0 text-[16px] font-semibold">{item.nombre}</h3>
            <span className="font-display text-[15px]">
              {formatearMoneda(item.precioUnitario * item.cantidad)}
            </span>
          </li>
        ))}
      </ul>

      <div className="total mt-1">
        <span>TOTAL</span>
        <span>{formatearMoneda(pedido.total)}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn"
          disabled={bloqueado}
          onClick={() => {
            if (siguiente) onCambiar(pedido.codigo, siguiente);
          }}
        >
          {guardando
            ? "Guardando…"
            : ETIQUETAS_ACCION[pedido.estado]}
        </button>
        <button
          type="button"
          className="btn-sm"
          disabled={bloqueado}
          onClick={() => onCambiar(pedido.codigo, "cancelado")}
        >
          Cancelar
        </button>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Gate de PIN                                                        */
/* ------------------------------------------------------------------ */

interface GatePinProps {
  error: string | null;
  enviando: boolean;
  pinTexto: string;
  onPinTextoChange: (valor: string) => void;
  onEntrar: (evento: FormEvent<HTMLFormElement>) => void;
}

function GatePin({
  error,
  enviando,
  pinTexto,
  onPinTextoChange,
  onEntrar,
}: GatePinProps) {
  return (
    <section>
      <div className="wrap">
        <div className="mx-auto max-w-md">
          <h1 className="title">Panel de cocina</h1>
          <p className="sub">Acceso restringido al equipo de cocina.</p>

          <form onSubmit={onEntrar} className="card p-6">
            <label htmlFor="pin-cocina" className="sr-only">
              PIN de la cocina
            </label>
            <input
              id="pin-cocina"
              name="pin"
              type="password"
              autoComplete="current-password"
              placeholder="PIN"
              value={pinTexto}
              onChange={(evento) => onPinTextoChange(evento.target.value)}
              className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--void)] px-3.5 py-3 text-[color:var(--star)]"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "pin-error" : undefined}
            />

            <button type="submit" className="btn fill go" disabled={enviando}>
              {enviando ? "Entrando…" : "Entrar"}
            </button>

            {error && (
              <p
                id="pin-error"
                role="alert"
                className="m-0 rounded-xl border border-[color:rgba(255,143,107,0.4)] bg-[color:rgba(255,143,107,0.08)] px-3 py-2 text-sm text-[color:var(--flame)]"
              >
                {error}
              </p>
            )}

            <p className="m-0 text-sm text-dim">
              PIN de la demo: 1234 · configurable con ADMIN_PIN en .env.local
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                              */
/* ------------------------------------------------------------------ */

export default function PanelCocina() {
  const hidratado = useHidratado();
  const [pin, setPin] = useState<string | null>(null);
  const [pinTexto, setPinTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [codigoGuardando, setCodigoGuardando] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<number | null>(
    null,
  );
  const [ahora, setAhora] = useState(0);
  const [anuncio, setAnuncio] = useState("");

  /** El PIN vigente, legible desde los intervalos sin recrearlos. */
  const pinRef = useRef<string | null>(null);
  /** Estados conocidos por código, para detectar altas y cambios. */
  const estadosRef = useRef<Map<string, EstadoPedido>>(
    new Map<string, EstadoPedido>(),
  );
  /** Distingue la primera carga de un refresco posterior. */
  const primeraCargaRef = useRef(true);

  const cerrarSesion = useCallback((mensaje?: string) => {
    try {
      window.sessionStorage.removeItem(CLAVE_PIN);
    } catch {
      // Almacenamiento no disponible: el PIN solo vivía en memoria.
    }
    pinRef.current = null;
    estadosRef.current = new Map<string, EstadoPedido>();
    primeraCargaRef.current = true;
    setPin(null);
    setPedidos([]);
    setFiltro("todos");
    setCodigoGuardando(null);
    setUltimaActualizacion(null);
    setError(mensaje ?? null);
    setAnuncio("");
  }, []);

  /** Compara la lista nueva con la conocida y anuncia solo lo que cambia. */
  const anunciarCambios = useCallback((lista: Pedido[]) => {
    const previos = estadosRef.current;
    const siguientes = new Map<string, EstadoPedido>();
    const altas: string[] = [];
    let cambios = 0;

    for (const pedido of lista) {
      siguientes.set(pedido.codigo, pedido.estado);
      const anterior = previos.get(pedido.codigo);
      if (anterior === undefined) altas.push(pedido.codigo);
      else if (anterior !== pedido.estado) cambios += 1;
    }

    if (primeraCargaRef.current) {
      primeraCargaRef.current = false;
      setAnuncio(
        lista.length === 0
          ? "No hay pedidos todavía."
          : `${lista.length} pedidos en el panel.`,
      );
    } else if (altas.length > 0) {
      setAnuncio(`Nuevo pedido en cocina: ${altas[0]}.`);
    } else if (cambios > 0) {
      setAnuncio("Hay pedidos con cambios de estado.");
    }

    estadosRef.current = siguientes;
  }, []);

  const cargarPedidos = useCallback(
    async (pinActual: string, silencioso: boolean) => {
      if (!silencioso) setCargando(true);
      try {
        const respuesta = await fetch("/api/orders", {
          headers: { "x-admin-pin": pinActual },
          cache: "no-store",
        });

        // Si la sesión cambió mientras esperaba la respuesta, se descarta.
        if (pinRef.current !== pinActual) return;

        if (respuesta.status === 401) {
          cerrarSesion(
            silencioso
              ? "Tu PIN ya no es válido. Vuelve a entrar."
              : "PIN inválido. Inténtalo de nuevo.",
          );
          return;
        }

        if (!respuesta.ok) {
          if (!silencioso) {
            setError("No pudimos cargar los pedidos. Inténtalo de nuevo.");
          }
          return;
        }

        const datos = (await respuesta.json().catch(() => null)) as
          | RespuestaListado
          | null;
        const pedidosApi = datos?.pedidos;
        const lista: Pedido[] = Array.isArray(pedidosApi) ? pedidosApi : [];

        anunciarCambios(lista);
        setPedidos(lista);
        setUltimaActualizacion(Date.now());
        setError(null);
      } catch {
        if (!silencioso) {
          setError("No pudimos conectar con la cocina. Revisa tu conexión.");
        }
      } finally {
        if (!silencioso) setCargando(false);
      }
    },
    [anunciarCambios, cerrarSesion],
  );

  // Hidratación: el PIN se recupera de sessionStorage, nunca del servidor.
  useEffect(() => {
    let pinGuardado: string | null = null;
    try {
      pinGuardado = window.sessionStorage.getItem(CLAVE_PIN);
    } catch {
      pinGuardado = null;
    }

    if (pinGuardado && pinGuardado.trim().length > 0) {
      const guardado = pinGuardado;
      // Se aplaza para no actualizar estado de forma síncrona dentro del efecto.
      const temporizador = window.setTimeout(() => {
        pinRef.current = guardado;
        setCargando(true);
        setPin(guardado);
      }, 0);
      return () => window.clearTimeout(temporizador);
    }
    return undefined;
  }, []);

  // Auto-refresco cada 5 s + carga inicial cuando hay sesión.
  useEffect(() => {
    if (!pin) return;

    // La carga se aplaza para no actualizar estado de forma síncrona en el efecto.
    const temporizador = window.setTimeout(() => {
      void cargarPedidos(pin, false);
    }, 0);

    const intervalo = window.setInterval(() => {
      const actual = pinRef.current;
      if (actual) void cargarPedidos(actual, true);
    }, INTERVALO_REFRESCO);

    return () => {
      window.clearTimeout(temporizador);
      window.clearInterval(intervalo);
    };
  }, [pin, cargarPedidos]);

  // Reloj del indicador "Actualizado hace X s".
  useEffect(() => {
    if (!pin) return;
    const intervalo = window.setInterval(() => {
      setAhora(Date.now());
    }, 1000);
    return () => window.clearInterval(intervalo);
  }, [pin]);

  async function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    const valor = pinTexto.trim();
    if (!valor) {
      setError("Escribe el PIN de la cocina.");
      return;
    }

    setEnviando(true);
    setError(null);
    setCargando(true);

    try {
      window.sessionStorage.setItem(CLAVE_PIN, valor);
    } catch {
      // Modo privado: el PIN se conserva solo en memoria.
    }

    pinRef.current = valor;
    setPin(valor);
    setEnviando(false);
  }

  async function refrescar() {
    const actual = pinRef.current;
    if (!actual) return;
    await cargarPedidos(actual, true);
  }

  async function cambiarEstado(codigo: string, estado: EstadoPedido) {
    const actual = pinRef.current;
    if (!actual || codigoGuardando) return;

    setCodigoGuardando(codigo);
    setError(null);

    try {
      const respuesta = await fetch(`/api/orders/${codigo}`, {
        method: "PATCH",
        headers: {
          "x-admin-pin": actual,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
      });

      if (respuesta.status === 401) {
        cerrarSesion("Tu PIN ya no es válido. Vuelve a entrar.");
        return;
      }

      if (!respuesta.ok) {
        const datos = (await respuesta.json().catch(() => null)) as
          | RespuestaPedido
          | null;
        setError(
          datos?.error ?? "No pudimos actualizar el pedido. Inténtalo de nuevo.",
        );
        return;
      }

      const datos = (await respuesta.json().catch(() => null)) as
        | RespuestaPedido
        | null;

      if (datos?.pedido) {
        const actualizado = datos.pedido;
        setPedidos((lista) =>
          lista.map((pedido) =>
            pedido.codigo === actualizado.codigo ? actualizado : pedido,
          ),
        );
      }

      setAnuncio(`Pedido ${codigo}: ${ETIQUETAS_ESTADO[estado]}.`);

      // Se anota el cambio para que el refresco posterior no lo anuncie dos veces.
      const estados = new Map(estadosRef.current);
      estados.set(codigo, estado);
      estadosRef.current = estados;

      await cargarPedidos(actual, true);
    } catch {
      setError("No pudimos conectar con la cocina. Revisa tu conexión.");
    } finally {
      setCodigoGuardando(null);
    }
  }

  const visibles = useMemo(
    () =>
      filtro === "todos"
        ? pedidos
        : pedidos.filter((pedido) => pedido.estado === filtro),
    [pedidos, filtro],
  );

  const conteos = useMemo(() => {
    const mapa: Record<string, number> = { todos: pedidos.length };
    for (const pedido of pedidos) {
      mapa[pedido.estado] = (mapa[pedido.estado] ?? 0) + 1;
    }
    return mapa;
  }, [pedidos]);

  // Segundos transcurridos desde la última respuesta correcta del servidor.
  const segundos = ultimaActualizacion
    ? Math.max(0, Math.floor((ahora - ultimaActualizacion) / 1000))
    : 0;

  const textoEstado = ultimaActualizacion
    ? `Actualizado hace ${segundos} s`
    : "Sin conexión con la cocina";

  const etiquetaFiltro =
    filtro === "todos" ? "Todos" : ETIQUETAS_ESTADO[filtro];

  if (!hidratado) {
    return (
      <section>
        <div className="wrap">
          <p className="empty">Abriendo el panel de cocina…</p>
        </div>
      </section>
    );
  }

  if (!pin) {
    return (
      <GatePin
        error={error}
        enviando={enviando}
        pinTexto={pinTexto}
        onPinTextoChange={(valor) => {
          setPinTexto(valor);
          if (error) setError(null);
        }}
        onEntrar={(evento) => void entrar(evento)}
      />
    );
  }

  return (
    <section>
      <div className="wrap">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-[260px] flex-1">
            <h1 className="title">Panel de cocina</h1>
            <p className="sub">
              Los pedidos caen aquí solos. Mueve cada uno por la línea hasta
              entregarlo.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <p className="m-0 text-sm text-dim">{textoEstado}</p>
              <button
                type="button"
                className="btn-sm inline-flex items-center"
                onClick={() => void refrescar()}
                aria-label="Refrescar pedidos ahora"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                  <path d="M20 5v6h-6" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              className="btn-sm"
              onClick={() => {
                setPinTexto("");
                cerrarSesion();
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {anuncio}
        </p>

        {error && (
          <p
            role="alert"
            className="mb-8 rounded-xl border border-[color:rgba(255,143,107,0.4)] bg-[color:rgba(255,143,107,0.08)] px-3 py-2 text-sm text-[color:var(--flame)]"
          >
            {error}
          </p>
        )}

        <div className="tabs" role="group" aria-label="Filtrar pedidos por estado">
          {FILTROS.map((opcion) => (
            <button
              key={opcion.id}
              type="button"
              aria-pressed={filtro === opcion.id}
              onClick={() => setFiltro(opcion.id)}
            >
              {opcion.etiqueta}
              <span className="ml-1 opacity-60">{conteos[opcion.id] ?? 0}</span>
            </button>
          ))}
        </div>

        {cargando && pedidos.length === 0 ? (
          <p className="empty">Cargando pedidos…</p>
        ) : pedidos.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="empty">
              Todavía no hay pedidos.
              <br />
              Arma un pedido desde el menú y aparecerá aquí al instante.
            </p>
            <div className="cta justify-center">
              <Link href="/menu" className="btn">
                Ver menú completo
              </Link>
            </div>
          </div>
        ) : visibles.length === 0 ? (
          <div className="empty">
            <p className="mb-4">
              No hay pedidos en estado {etiquetaFiltro}.
            </p>
            <button type="button" className="btn-sm" onClick={() => setFiltro("todos")}>
              Ver todos los pedidos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibles.map((pedido) => (
              <TarjetaPedido
                key={pedido.codigo}
                pedido={pedido}
                guardando={codigoGuardando === pedido.codigo}
                onCambiar={(codigo, estado) => void cambiarEstado(codigo, estado)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
