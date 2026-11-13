import type { Categoria, Producto } from "./types";

/**
 * Catálogo de Algo Diferente: cinco parrillas, cuatro hamburguesas,
 * tres pepitos, tres acompañantes y tres bebidas.
 *
 * Los orbes reinterpretan cada plato como una brasa encendida: el
 * gradiente va de la superficie caliente al carbón y el `glow` es el
 * resplandor que proyecta sobre el fondo negro.
 */
export const PRODUCTOS: Producto[] = [
  /* ---------------------------------------------------------- Parrillas */
  {
    id: "costillas",
    nombre: "Costillas BBQ",
    categoria: "parrillas",
    precio: 185,
    descripcion:
      "Costillas de cerdo glaseadas a fuego lento con nuestra salsa de la casa.",
    etiqueta: "La especialidad",
    stats: ["1/2 rack", "Ahumada", "25 min"],
    colores: ["#ffd9a8", "#e0722a", "#2a1206"],
    glow: "rgba(255,140,60,.45)",
    textura:
      "repeating-linear-gradient(0deg, rgba(0,0,0,.32) 0 7%, transparent 7% 15%)",
  },
  {
    id: "chorizo",
    nombre: "Chorizo asado",
    categoria: "parrillas",
    precio: 95,
    descripcion: "Chorizo fresco a las brasas con cebolla y limón.",
    stats: ["4 piezas", "Picante", "12 min"],
    colores: ["#ffb98a", "#e2501f", "#3a0f06"],
    glow: "rgba(255,100,40,.45)",
  },
  {
    id: "pollo",
    nombre: "Pollo a las brasas",
    categoria: "parrillas",
    precio: 145,
    descripcion: "Medio pollo marinado y asado al carbón, jugoso y dorado.",
    etiqueta: "El favorito",
    stats: ["1/2 pollo", "Suave", "30 min"],
    colores: ["#ffe3b0", "#d98a3a", "#3c2012"],
    glow: "rgba(255,170,90,.4)",
    textura:
      "radial-gradient(30% 22% at 38% 42%, rgba(120,50,10,.55), transparent), radial-gradient(24% 18% at 66% 60%, rgba(120,50,10,.5), transparent)",
  },
  {
    id: "mixta",
    nombre: "Parrilla mixta",
    categoria: "parrillas",
    precio: 235,
    descripcion: "Para compartir: costillas, chorizo, pollo y carne a las brasas.",
    etiqueta: "Para dos",
    stats: ["600 g", "Medio", "35 min"],
    colores: ["#ffc98a", "#c9601f", "#2a1408"],
    glow: "rgba(255,130,50,.45)",
    anillo: true,
    textura:
      "repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 6%, transparent 6% 14%)",
  },
  {
    id: "carne",
    nombre: "Carne asada",
    categoria: "parrillas",
    precio: 165,
    descripcion: "Corte de res a las brasas con cebolla y arepita caliente.",
    stats: ["250 g", "Suave", "18 min"],
    colores: ["#f2c79a", "#b5642c", "#2e1508"],
    glow: "rgba(230,140,70,.4)",
    textura:
      "radial-gradient(26% 20% at 44% 38%, rgba(90,35,8,.5), transparent), radial-gradient(20% 16% at 62% 64%, rgba(90,35,8,.45), transparent)",
  },

  /* ------------------------------------------------------- Hamburguesas */
  {
    id: "clasica",
    nombre: "La clásica",
    categoria: "hamburguesas",
    precio: 85,
    descripcion:
      "Carne de 150 g, queso, lechuga, jitomate y aderezo de la casa en pan brioche.",
    etiqueta: "La de siempre",
    stats: ["150 g", "Suave", "10 min"],
    colores: ["#ffe0b0", "#d99342", "#3a2010"],
    glow: "rgba(255,180,100,.4)",
  },
  {
    id: "doble",
    nombre: "Doble queso",
    categoria: "hamburguesas",
    precio: 130,
    descripcion: "Doble carne de 150 g, doble cheddar y cebolla caramelizada.",
    etiqueta: "Para el hambre",
    stats: ["300 g", "Suave", "12 min"],
    colores: ["#ffd9a0", "#c97a2e", "#33190a"],
    glow: "rgba(255,160,80,.4)",
    textura:
      "repeating-linear-gradient(0deg, rgba(120,50,10,.5) 0 6%, rgba(255,220,170,.35) 6% 12%)",
  },
  {
    id: "ahumada",
    nombre: "Ahumada",
    categoria: "hamburguesas",
    precio: 125,
    descripcion: "Carne de 150 g, tocino crujiente, queso ahumado y salsa BBQ.",
    etiqueta: "Con humo",
    stats: ["150 g", "Medio", "12 min"],
    colores: ["#e8b98a", "#a86a33", "#2a1608"],
    glow: "rgba(240,150,80,.35)",
    textura:
      "radial-gradient(60% 40% at 50% 30%, rgba(255,235,200,.4), transparent), radial-gradient(50% 34% at 30% 70%, rgba(70,30,10,.5), transparent)",
  },
  {
    id: "picante",
    nombre: "La picante",
    categoria: "hamburguesas",
    precio: 120,
    descripcion:
      "Carne de 150 g, jalapeño, salsa de chipotle y cheddar fundido. Prende.",
    etiqueta: "Para valientes",
    stats: ["150 g", "Picante", "12 min"],
    colores: ["#ff9a6b", "#d9421f", "#3a0f06"],
    glow: "rgba(255,90,40,.5)",
    textura:
      "radial-gradient(14% 10% at 30% 60%, rgba(0,0,0,.5), transparent), radial-gradient(10% 8% at 62% 34%, rgba(0,0,0,.45), transparent)",
  },

  /* ------------------------------------------------------------ Pepitos */
  {
    id: "pepito-clasico",
    nombre: "Pepito clásico",
    categoria: "pepitos",
    precio: 110,
    descripcion:
      "Carne a la parrilla, queso, tomate y papas fritas en pan largo.",
    etiqueta: "El de siempre",
    colores: ["#f2d3a6", "#c88a55", "#3c2012"],
    glow: "rgba(255,180,110,.35)",
    textura:
      "repeating-linear-gradient(90deg, rgba(120,60,20,.35) 0 10%, transparent 10% 22%)",
  },
  {
    id: "pepito-mixto",
    nombre: "Pepito mixto",
    categoria: "pepitos",
    precio: 130,
    descripcion:
      "Mezcla de carnes, queso, jamón y vegetales a la parrilla en pan largo.",
    etiqueta: "El más pedido",
    colores: ["#ffd9a8", "#d1782e", "#33190c"],
    glow: "rgba(255,150,70,.4)",
    textura:
      "repeating-linear-gradient(90deg, rgba(120,60,20,.3) 0 8%, transparent 8% 20%)",
  },
  {
    id: "pepito-pollo",
    nombre: "Pepito de pollo",
    categoria: "pepitos",
    precio: 115,
    descripcion: "Pollo a la parrilla, queso, lechuga y aderezo especial.",
    colores: ["#ffe9c4", "#d9a45c", "#402512"],
    glow: "rgba(255,200,130,.35)",
    textura:
      "repeating-linear-gradient(90deg, rgba(140,70,25,.3) 0 9%, transparent 9% 21%)",
  },

  /* ------------------------------------------------------- Acompañantes */
  {
    id: "papas",
    nombre: "Papas rústicas",
    categoria: "acompanantes",
    precio: 60,
    descripcion: "Papas con sal de mar y especias, crujientes por fuera.",
    colores: ["#ffe9a0", "#f0b429", "#5a3a05"],
    glow: "rgba(255,200,80,.4)",
  },
  {
    id: "arepas",
    nombre: "Arepas con queso",
    categoria: "acompanantes",
    precio: 50,
    descripcion: "Arepas de maíz rellenas de queso derretido.",
    colores: ["#fff0c4", "#e0b86a", "#4d3410"],
    glow: "rgba(255,214,130,.4)",
    anillo: true,
  },
  {
    id: "alitas",
    nombre: "Alitas BBQ",
    categoria: "acompanantes",
    precio: 95,
    descripcion: "Alitas glaseadas con salsa BBQ ahumada.",
    colores: ["#ffcf9a", "#d96c2a", "#331608"],
    glow: "rgba(255,140,60,.4)",
    textura:
      "repeating-linear-gradient(0deg, rgba(0,0,0,.3) 0 6%, transparent 6% 13%)",
  },

  /* ------------------------------------------------------------ Bebidas */
  {
    id: "refresco",
    nombre: "Refresco",
    categoria: "bebidas",
    precio: 35,
    descripcion: "Refresco de cola, naranja o limón, sin límite de recargas.",
    colores: ["#ff8f6b", "#c93a1c", "#3a0c04"],
    glow: "rgba(255,110,60,.35)",
  },
  {
    id: "limonada",
    nombre: "Limonada de la casa",
    categoria: "bebidas",
    precio: 45,
    descripcion: "Limonada fresca con hierbabuena y hielo.",
    colores: ["#ffe98a", "#e0c23a", "#4a3a06"],
    glow: "rgba(255,230,100,.4)",
  },
  {
    id: "malteada",
    nombre: "Malteada de chocolate",
    categoria: "bebidas",
    precio: 75,
    descripcion: "Malteada espesa de chocolate para cerrar con dulce.",
    colores: ["#8a6a55", "#3a2418", "#0a0605"],
    glow: "rgba(160,110,80,.3)",
  },
];

export const CATEGORIAS: { id: Categoria; nombre: string }[] = [
  { id: "parrillas", nombre: "Parrillas" },
  { id: "hamburguesas", nombre: "Hamburguesas" },
  { id: "pepitos", nombre: "Pepitos" },
  { id: "acompanantes", nombre: "Acompañantes" },
  { id: "bebidas", nombre: "Bebidas" },
];

/** Lo más pedido: parrillas y hamburguesas para el tour y la home. */
export const DESTACADOS: Producto[] = PRODUCTOS.filter(
  (p) => p.categoria === "parrillas" || p.categoria === "hamburguesas",
);

export function obtenerProducto(id: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id);
}

export function productosPorCategoria(categoria: Categoria): Producto[] {
  return PRODUCTOS.filter((p) => p.categoria === categoria);
}
