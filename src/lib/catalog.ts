import type { Categoria, Producto } from "./types";

/**
 * Catálogo de Ávila Planet. Mismo contenido que la landing original:
 * seis planetas (hamburguesas), tres acompañantes y tres bebidas.
 */
export const PRODUCTOS: Producto[] = [
  {
    id: "mercurio",
    nombre: "Mercurio",
    categoria: "hamburguesas",
    precio: 85,
    descripcion:
      "Carne de 120 g, queso cheddar, pepinillo y cebolla en pan brioche. Pequeña, rápida y directa.",
    etiqueta: "La clásica",
    stats: ["120 g", "Suave", "8 min"],
    colores: ["#d9d6d0", "#8c8780", "#2b2a29"],
    glow: "rgba(200,200,200,.25)",
  },
  {
    id: "venus",
    nombre: "Venus",
    categoria: "hamburguesas",
    precio: 115,
    descripcion:
      "Carne de 150 g, piña asada, tocino crujiente, queso suizo y salsa de miel con mostaza.",
    etiqueta: "Dulce y ahumada",
    stats: ["150 g", "Suave", "12 min"],
    colores: ["#ffe2a8", "#d99a42", "#4a2a0c"],
    glow: "rgba(255,190,100,.35)",
  },
  {
    id: "tierra",
    nombre: "Tierra",
    categoria: "hamburguesas",
    precio: 120,
    descripcion:
      "Carne de 150 g, lechuga, jitomate, queso americano y nuestro aderezo secreto. El punto de partida.",
    etiqueta: "La de la casa",
    stats: ["150 g", "Medio", "10 min"],
    colores: ["#7fc1ff", "#2a6bd1", "#06173a"],
    glow: "rgba(80,150,255,.45)",
    textura:
      "radial-gradient(30% 20% at 40% 40%,rgba(80,200,120,.9),transparent),radial-gradient(22% 16% at 66% 62%,rgba(80,200,120,.8),transparent)",
  },
  {
    id: "marte",
    nombre: "Marte",
    categoria: "hamburguesas",
    precio: 130,
    descripcion:
      "Carne de 150 g, jalapeño, salsa de chipotle, cheddar fundido y cebolla frita. Prende y no suelta.",
    etiqueta: "El planeta rojo",
    stats: ["150 g", "Picante", "12 min"],
    colores: ["#ff9a6b", "#d9421f", "#3a0f06"],
    glow: "rgba(226,85,45,.5)",
    textura:
      "radial-gradient(14% 10% at 30% 60%,rgba(0,0,0,.5),transparent),radial-gradient(10% 8% at 62% 34%,rgba(0,0,0,.45),transparent)",
  },
  {
    id: "jupiter",
    nombre: "Júpiter",
    categoria: "hamburguesas",
    precio: 185,
    descripcion:
      "Doble carne de 180 g, doble queso, tocino y pepinillos. Para quien viene con hambre de verdad.",
    etiqueta: "El gigante",
    stats: ["360 g", "Medio", "16 min"],
    colores: ["#f2d3a6", "#c88a55", "#3c2012"],
    glow: "rgba(220,160,100,.4)",
    textura:
      "repeating-linear-gradient(0deg,rgba(120,60,20,.7) 0 6%,rgba(255,235,200,.5) 6% 12%,rgba(150,80,40,.6) 12% 17%)",
  },
  {
    id: "saturno",
    nombre: "Saturno",
    categoria: "hamburguesas",
    precio: 145,
    descripcion:
      "Carne de 150 g, aros de cebolla empanizados, salsa BBQ ahumada y cheddar. Crujiente por todos lados.",
    etiqueta: "Con anillos",
    stats: ["150 g", "Suave", "14 min"],
    colores: ["#fff0c4", "#e0b86a", "#4d3410"],
    glow: "rgba(255,214,130,.4)",
    anillo: true,
    textura:
      "repeating-linear-gradient(0deg,rgba(150,100,30,.5) 0 8%,rgba(255,245,210,.4) 8% 14%)",
  },
  {
    id: "cometas",
    nombre: "Cometas",
    categoria: "acompanantes",
    precio: 55,
    descripcion: "Papas a la francesa con sal de mar y salsa a elegir.",
    colores: ["#ffe9a0", "#f0b429", "#5a3a05"],
    glow: "rgba(255,200,80,.35)",
  },
  {
    id: "anillos",
    nombre: "Anillos",
    categoria: "acompanantes",
    precio: 60,
    descripcion: "Aros de cebolla empanizados con aderezo ranch.",
    colores: ["#ffe2b8", "#d99a52", "#4a2a0c"],
    glow: "rgba(255,180,100,.3)",
    anillo: true,
  },
  {
    id: "asteroides",
    nombre: "Asteroides",
    categoria: "acompanantes",
    precio: 70,
    descripcion: "Nuggets de pollo con salsa BBQ o mostaza miel.",
    colores: ["#c9a27a", "#8a5a35", "#2a1608"],
    glow: "rgba(200,140,90,.3)",
  },
  {
    id: "nebulosa",
    nombre: "Nebulosa",
    categoria: "bebidas",
    precio: 45,
    descripcion: "Limonada de frutos morados con hielo.",
    colores: ["#e4b0ff", "#8a3ad9", "#220a42"],
    glow: "rgba(170,90,255,.4)",
  },
  {
    id: "agujero",
    nombre: "Agujero negro",
    categoria: "bebidas",
    precio: 75,
    descripcion: "Malteada espesa de chocolate oscuro.",
    colores: ["#6b4a3a", "#2a1710", "#050302"],
    glow: "rgba(140,100,80,.3)",
  },
  {
    id: "cola",
    nombre: "Gravedad cero",
    categoria: "bebidas",
    precio: 35,
    descripcion: "Refresco de cola o de naranja, sin límite de recargas.",
    colores: ["#ff8f6b", "#c93a1c", "#3a0c04"],
    glow: "rgba(220,80,50,.3)",
  },
];

export const CATEGORIAS: { id: Categoria; nombre: string }[] = [
  { id: "hamburguesas", nombre: "Hamburguesas" },
  { id: "acompanantes", nombre: "Acompañantes" },
  { id: "bebidas", nombre: "Bebidas" },
];

export const BURGUERSAS: Producto[] = PRODUCTOS.filter(
  (p) => p.categoria === "hamburguesas",
);

export function obtenerProducto(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}

export function productosPorCategoria(categoria: Categoria): Producto[] {
  return PRODUCTOS.filter((p) => p.categoria === categoria);
}
