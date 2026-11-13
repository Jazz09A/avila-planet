import type { Metadata, Viewport } from "next";
import { Jura, Syncopate } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileDock from "@/components/MobileDock";
import Brasas from "@/components/Brasas";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

const jura = Jura({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-jura",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Algo Diferente · Parrillas, hamburguesas y pepitos",
  description:
    "Parrillas, hamburguesas y pepitos a las brasas. Elige, agrega al pedido y recíbelo en minutos.",
  keywords: ["parrillas", "hamburguesas", "pepitos", "Algo Diferente", "comida", "restaurante", "delivery"],
  openGraph: {
    title: "Algo Diferente · Parrillas, hamburguesas y pepitos",
    description:
      "Parrillas, hamburguesas y pepitos a las brasas. Elige, agrega al pedido y recíbelo en minutos.",
    type: "website",
    locale: "es_MX",
    siteName: "Algo Diferente",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${syncopate.variable} ${jura.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <CartProvider>
          <Brasas />
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileDock />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
