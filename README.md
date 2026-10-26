# Ávila Planet · Hamburguesas de otro planeta

Demo local de un e-commerce de hamburguesas con tema espacial, construida con
**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

El diseño replica la landing original (`Ávila Planet · Hamburguesas de otro planeta.html`),
que se encuentra en la carpeta padre y sirve como referencia visual.

## Puesta en marcha

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Otros scripts:

```bash
pnpm build        # build de producción
pnpm start        # sirve el build
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

> El PIN del panel de cocina se define en `.env.local` (`ADMIN_PIN`, por defecto `1234`).

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Home: hero con cielo estrellado, tour de los 6 planetas, menú y "cómo pedir" |
| `/menu` | Catálogo completo con pestañas (hamburguesas, acompañantes, bebidas) y buscador |
| `/carrito` | Carrito en página completa con el checkout |
| `/pedido/[codigo]` | Confirmación y seguimiento del pedido (`OB-####`) |
| `/admin` | Panel de cocina: pedidos entrantes y cambio de estado (PIN) |

## Arquitectura

```
src/
├─ app/
│  ├─ layout.tsx              # fuentes, providers, header, dock, footer, drawer global
│  ├─ globals.css             # Tailwind v4 + sistema de diseño (tokens + CSS de la landing)
│  ├─ api/orders/route.ts     # POST crear pedido · GET listar (admin)
│  ├─ api/orders/[codigo]/    # GET tracking · PATCH estado (admin)
│  ├─ menu/page.tsx
│  ├─ carrito/page.tsx
│  ├─ pedido/[codido]/page.tsx
│  └─ admin/page.tsx
├─ components/                # Starfield, Header, MobileDock, Hero, PlanetTour,
│                             # PlanetOrb, ProductCard, MenuTabs, CartDrawer,
│                             # CartLines, CheckoutForm, EstadoPedido, HowItWorks, Footer
└─ lib/
   ├─ types.ts                # Producto, Pedido, estados, etiquetas
   ├─ catalog.ts              # los 12 productos
   ├─ cart.tsx + carrito-store.ts  # contexto del carrito (useSyncExternalStore + localStorage)
   ├─ orders.ts               # store JSON de pedidos (escritura atómica)
   ├─ validation.ts           # esquemas zod
   ├─ admin.ts                # validación del PIN
   ├─ money.ts, spark.ts, http.ts
```

### Decisiones

- **Carrito en el cliente**: `useSyncExternalStore` sobre un store externo con
  persistencia en `localStorage`. El servidor siempre renderiza el carrito vacío,
  así que no hay desajustes de hidratación ni parpadeos.
- **Pedidos en el servidor**: archivo `.data/orders.json` (ignorado por git).
  Escritura atómica (`.tmp` + `rename`) y cola de escrituras para que dos
  pedidos simultáneos no se pisen.
- **El precio nunca viene del cliente**: `POST /api/orders` recalcula los
  importes desde el catálogo del servidor.
- **Panel de cocina protegido**: `GET /api/orders` y `PATCH /api/orders/[codigo]`
  exigen la cabecera `x-admin-pin`.
- **Sin base de datos ni dependencias nativas**: la demo arranca con `pnpm install` y ya.
