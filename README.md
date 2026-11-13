# Algo Diferente · Parrillas, hamburguesas y pepitos

Demo local de un e-commerce de parrillas con tema de brasas, construida con
**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

Adaptación de la demo original «Ávila Planet»: nueva identidad (negro +
naranja), nuevo catálogo (parrillas, hamburguesas, pepitos, acompañantes
y bebidas) y fondo de brasas animadas.

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
| `/` | Home: hero con brasas, tour de especialidades, menú y "cómo pedir" |
| `/menu` | Catálogo completo con pestañas (parrillas, hamburguesas, pepitos, acompañantes, bebidas) y buscador |
| `/carrito` | Carrito en página completa con el checkout |
| `/pedido/[codigo]` | Confirmación y seguimiento del pedido (`AD-####`) |
| `/admin` | Panel de cocina: pedidos entrantes y cambio de estado (PIN) |

## Arquitectura

```
src/
├─ app/
│  ├─ layout.tsx              # fuentes, providers, header, dock, footer, drawer global
│  ├─ globals.css             # Tailwind v4 + sistema de diseño (tokens + CSS)
│  ├─ api/orders/route.ts     # POST crear pedido · GET listar (admin)
│  ├─ api/orders/[codigo]/    # GET tracking · PATCH estado (admin)
│  ├─ menu/page.tsx
│  ├─ carrito/page.tsx
│  ├─ pedido/[codigo]/page.tsx
│  └─ admin/page.tsx
├─ components/                # Brasas, Header, MobileDock, Hero, EspecialTour,
│                             # BrasaOrb, ProductCard, MenuTabs, CartDrawer,
│                             # CartLines, CheckoutForm, EstadoPedido, HowItWorks, Footer
└─ lib/
   ├─ types.ts                # Producto, Pedido, estados, etiquetas
   ├─ catalog.ts              # los 18 productos
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
- **El CSS del diseño vive en `@layer components`**: así las utilidades de Tailwind
  (capa `utilities`) pueden sobrescribirlo (`sm:grid-cols-2`, `gap-4`…) sin tener que
  recurrir a `!important`. Las clases propias (`grid`, `item`, `btn`…) mandan sobre el
  preflight de Tailwind (capa `base`), que es lo que quiere el diseño original.

### Identidad

- Paleta: negro `#0b0b0c` / `#17171a` + naranja `#ff7a1a` (tokens `--void`,
  `--deep`, `--fire`, `--ember`… en `globals.css`).
- Fondo: canvas de brasas ascendentes (`components/Brasas.tsx`).
- Logo: SVG temporal en el header; sustituir por el archivo real en `public/`
  (slot comentado en `components/Header.tsx`).
- Instagram: enlaces placeholder en header y footer.
