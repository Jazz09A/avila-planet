import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  Cliente,
  EstadoPedido,
  LineaPedido,
  MetodoPago,
  ModoEntrega,
  Pedido,
} from "@/lib/types";

/**
 * Store de pedidos de la demo: archivo JSON local en `.data/orders.json`.
 *
 * Solo usable desde el servidor (usa `node:fs`), nunca desde componentes de cliente.
 */

const DIRECTORIO_DATOS = path.join(process.cwd(), ".data");
const ARCHIVO_PEDIDOS = path.join(DIRECTORIO_DATOS, "orders.json");
const ARCHIVO_TEMPORAL = path.join(DIRECTORIO_DATOS, "orders.json.tmp");

/** Datos de entrada para crear un pedido (el código y las fechas los pone el store). */
export interface DatosPedido {
  modo: ModoEntrega;
  metodoPago: MetodoPago;
  cliente: Cliente;
  items: LineaPedido[];
  subtotal: number;
  total: number;
  minutosEstimados: number;
}

/**
 * Serializa las escrituras: dos pedidos simultáneos no pueden pisarse
 * el read-modify-write del archivo.
 */
let cola: Promise<unknown> = Promise.resolve();

function encolar<T>(accion: () => Promise<T>): Promise<T> {
  const resultado = cola.then(accion, accion);
  cola = resultado.then(
    () => undefined,
    () => undefined,
  );
  return resultado;
}

function detalle(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function esErrorDeCodigo(error: unknown, codigo: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as NodeJS.ErrnoException).code === codigo
  );
}

/** Filtro defensivo: el archivo es editable a mano, así que se descartan filas inválidas. */
function esPedido(valor: unknown): valor is Pedido {
  if (typeof valor !== "object" || valor === null) return false;
  const candidato = valor as Partial<Pedido>;
  return (
    typeof candidato.codigo === "string" &&
    typeof candidato.creadoEn === "string" &&
    typeof candidato.actualizadoEn === "string" &&
    typeof candidato.estado === "string"
  );
}

/** Normaliza a `OB-####`: acepta `OB-1234`, `ob-1234` y `1234`. */
function normalizarCodigo(codigo: string): string {
  const limpio = codigo.trim().toUpperCase();
  return limpio.startsWith("OB-") ? limpio : `OB-${limpio}`;
}

function marcaTiempo(iso: string): number {
  const valor = Date.parse(iso);
  return Number.isNaN(valor) ? 0 : valor;
}

/** Lee el store. Si no existe o está corrupto, arranca con una lista vacía. */
async function leerPedidos(): Promise<Pedido[]> {
  let crudo: string;
  try {
    crudo = await readFile(ARCHIVO_PEDIDOS, "utf8");
  } catch (error) {
    if (esErrorDeCodigo(error, "ENOENT")) return [];
    throw new Error(`No se pudo leer el archivo de pedidos: ${detalle(error)}`);
  }

  try {
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) return [];
    return datos.filter(esPedido);
  } catch {
    // JSON inválido: se reinicia el store en vez de romper la demo.
    return [];
  }
}

/** Escritura atómica: se escribe en `.tmp` y se renombra al archivo final. */
async function escribirPedidos(pedidos: Pedido[]): Promise<void> {
  try {
    await mkdir(DIRECTORIO_DATOS, { recursive: true });
    await writeFile(
      ARCHIVO_TEMPORAL,
      `${JSON.stringify(pedidos, null, 2)}\n`,
      "utf8",
    );
    await rename(ARCHIVO_TEMPORAL, ARCHIVO_PEDIDOS);
  } catch (error) {
    throw new Error(
      `No se pudo guardar el pedido: el directorio "${DIRECTORIO_DATOS}" no es escribible (${detalle(error)}).`,
    );
  }
}

/** Genera un código `OB-####` que todavía no existe en el store. */
function generarCodigo(existentes: Set<string>): string {
  for (let intento = 0; intento < 200; intento += 1) {
    const codigo = `OB-${1000 + Math.floor(Math.random() * 9000)}`;
    if (!existentes.has(codigo)) return codigo;
  }
  // Todos los aleatorios ocupados: se toma el primer hueco libre.
  for (let numero = 1000; numero <= 9999; numero += 1) {
    const codigo = `OB-${numero}`;
    if (!existentes.has(codigo)) return codigo;
  }
  throw new Error("No quedan códigos de pedido disponibles.");
}

/** Lista los pedidos del más reciente al más antiguo. */
export async function listarPedidos(): Promise<Pedido[]> {
  const pedidos = await leerPedidos();
  return [...pedidos].sort(
    (a, b) => marcaTiempo(b.creadoEn) - marcaTiempo(a.creadoEn),
  );
}

/** Busca un pedido por código (acepta `OB-1234` y `1234`). */
export async function obtenerPedido(codigo: string): Promise<Pedido | null> {
  const objetivo = normalizarCodigo(codigo);
  const pedidos = await leerPedidos();
  const encontrado = pedidos.find(
    (pedido) => normalizarCodigo(pedido.codigo) === objetivo,
  );
  return encontrado ?? null;
}

/** Crea un pedido: el código y las marcas de tiempo los genera el store. */
export async function crearPedido(datos: DatosPedido): Promise<Pedido> {
  return encolar(async () => {
    const pedidos = await leerPedidos();
    const codigo = generarCodigo(
      new Set(pedidos.map((pedido) => normalizarCodigo(pedido.codigo))),
    );
    const ahora = new Date().toISOString();
    const pedido: Pedido = {
      codigo,
      creadoEn: ahora,
      actualizadoEn: ahora,
      estado: "recibido",
      modo: datos.modo,
      metodoPago: datos.metodoPago,
      cliente: datos.cliente,
      items: datos.items,
      subtotal: datos.subtotal,
      total: datos.total,
      minutosEstimados: datos.minutosEstimados,
    };
    pedidos.push(pedido);
    await escribirPedidos(pedidos);
    return pedido;
  });
}

/**
 * Cambia el estado de un pedido. Si el estado ya era ese, devuelve el pedido
 * sin tocarlo. Devuelve `null` si el pedido no existe.
 */
export async function actualizarEstado(
  codigo: string,
  estado: EstadoPedido,
): Promise<Pedido | null> {
  return encolar(async () => {
    const pedidos = await leerPedidos();
    const objetivo = normalizarCodigo(codigo);
    const indice = pedidos.findIndex(
      (pedido) => normalizarCodigo(pedido.codigo) === objetivo,
    );
    if (indice === -1) return null;

    const actual = pedidos[indice];
    if (actual.estado === estado) return actual;

    const actualizado: Pedido = {
      ...actual,
      estado,
      actualizadoEn: new Date().toISOString(),
    };
    pedidos[indice] = actualizado;
    await escribirPedidos(pedidos);
    return actualizado;
  });
}
