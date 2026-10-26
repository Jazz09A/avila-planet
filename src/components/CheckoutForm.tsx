"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "@/lib/cart";
import type { MetodoPago, ModoEntrega } from "@/lib/types";

interface Props {
  /** `true` dentro del drawer: menos aire y sin notas auxiliares. */
  compacta?: boolean;
}

interface RespuestaOrden {
  codigo?: string;
  error?: string;
}

function leerMetodoPago(valor: string): MetodoPago {
  if (valor === "transferencia" || valor === "contra_entrega") return valor;
  return "efectivo";
}

/**
 * Formulario de pedido: replica el `form` de la landing original
 * (modo de entrega, nombre, teléfono, dirección y botón de confirmar)
 * y lo convierte en el checkout real contra `POST /api/orders`.
 */
export function CheckoutForm({ compacta = false }: Props) {
  const router = useRouter();
  const { lineas, detalle, vaciar, cerrar } = useCarrito();

  const idNombre = useId();
  const idTelefono = useId();
  const idDireccion = useId();
  const idPago = useId();

  const [modo, setModo] = useState<ModoEntrega>("recoger");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const domicilio = modo === "domicilio";

  function elegirModo(siguiente: ModoEntrega) {
    setModo(siguiente);
    // El pago contra entrega solo tiene sentido a domicilio.
    if (siguiente === "recoger" && metodoPago === "contra_entrega") {
      setMetodoPago("efectivo");
    }
    setError(null);
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;

    // Validación en cliente antes de tocar la red.
    if (detalle.length === 0) {
      setError("Tu pedido está vacío. Agrega al menos un planeta.");
      return;
    }
    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre (mínimo 2 caracteres).");
      return;
    }
    if (telefono.trim().length < 7) {
      setError("Escribe un teléfono válido (mínimo 7 caracteres).");
      return;
    }
    if (domicilio && !direccion.trim()) {
      setError("Escribe la dirección de entrega para continuar.");
      return;
    }

    setError(null);
    setEnviando(true);

    const cuerpo: Record<string, unknown> = {
      modo,
      metodoPago,
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      items: lineas.map((linea) => ({ id: linea.id, cantidad: linea.cantidad })),
    };
    if (domicilio) cuerpo.direccion = direccion.trim();

    try {
      const respuesta = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      const datos = (await respuesta.json().catch(() => null)) as
        | RespuestaOrden
        | null;

      if (!respuesta.ok) {
        setError(
          datos?.error ??
            "No pudimos confirmar tu pedido. Inténtalo de nuevo en un momento.",
        );
        setEnviando(false);
        return;
      }

      if (!datos?.codigo) {
        setError(
          "El pedido se registró pero no pudimos obtener el código. Inténtalo de nuevo.",
        );
        setEnviando(false);
        return;
      }

      vaciar();
      cerrar();
      router.push(`/pedido/${datos.codigo}`);
    } catch {
      setError(
        "No pudimos conectar con la cocina. Revisa tu conexión e inténtalo de nuevo.",
      );
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} aria-busy={enviando}>
      <div className="mode" role="radiogroup" aria-label="Modo de entrega">
        <label>
          <input
            type="radio"
            name="modo"
            value="recoger"
            checked={modo === "recoger"}
            onChange={() => elegirModo("recoger")}
          />
          Recoger
        </label>
        <label>
          <input
            type="radio"
            name="modo"
            value="domicilio"
            checked={domicilio}
            onChange={() => elegirModo("domicilio")}
          />
          A domicilio
        </label>
      </div>

      <div className={compacta ? "grid gap-2" : "grid gap-3"}>
        <label className="sr-only" htmlFor={idNombre}>
          Tu nombre
        </label>
        <input
          id={idNombre}
          type="text"
          name="nombre"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Tu nombre"
          value={nombre}
          onChange={(evento) => {
            setNombre(evento.target.value);
            setError(null);
          }}
        />

        <label className="sr-only" htmlFor={idTelefono}>
          Teléfono
        </label>
        <input
          id={idTelefono}
          type="tel"
          name="telefono"
          autoComplete="tel"
          inputMode="tel"
          required
          minLength={7}
          maxLength={20}
          placeholder="Teléfono"
          value={telefono}
          onChange={(evento) => {
            setTelefono(evento.target.value);
            setError(null);
          }}
        />

        <label className="sr-only" htmlFor={idDireccion}>
          Dirección de entrega
        </label>
        <input
          id={idDireccion}
          type="text"
          name="direccion"
          autoComplete="street-address"
          required={domicilio}
          maxLength={200}
          placeholder="Dirección de entrega"
          hidden={!domicilio}
          value={direccion}
          onChange={(evento) => {
            setDireccion(evento.target.value);
            setError(null);
          }}
        />
      </div>

      <div className={compacta ? "grid gap-2" : "grid gap-3"}>
        <label
          htmlFor={idPago}
          className={
            compacta
              ? "sr-only"
              : "text-xs uppercase tracking-[0.18em] text-[color:var(--dim)]"
          }
        >
          Método de pago
        </label>
        <select
          id={idPago}
          name="metodoPago"
          value={metodoPago}
          onChange={(evento) => {
            setMetodoPago(leerMetodoPago(evento.target.value));
            setError(null);
          }}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          {domicilio && (
            <option value="contra_entrega">Pago contra entrega</option>
          )}
        </select>
        {!compacta && (
          <p className="m-0 text-sm text-[color:var(--dim)]">
            El pago contra entrega solo está disponible para pedidos a domicilio.
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="m-0 rounded-xl border border-[color:rgba(255,143,107,0.4)] bg-[color:rgba(255,143,107,0.08)] px-3 py-2 text-sm text-[color:var(--flame)]"
        >
          {error}
        </p>
      )}

      <button type="submit" className="btn fill go" disabled={enviando}>
        {enviando ? "Enviando…" : "Confirmar pedido"}
      </button>
    </form>
  );
}

export default CheckoutForm;
