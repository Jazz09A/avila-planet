"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCarrito } from "@/lib/cart";

export function Header() {
  const { cantidadTotal, abrir } = useCarrito();
  const progreso = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function pintar() {
      const barra = progreso.current;
      if (!barra) return;
      const maximo = document.documentElement.scrollHeight - window.innerHeight;
      const avance = maximo > 0 ? Math.min(window.scrollY / maximo, 1) : 0;
      barra.style.transform = `scaleX(${avance})`;
    }
    pintar();
    window.addEventListener("scroll", pintar, { passive: true });
    window.addEventListener("resize", pintar);
    return () => {
      window.removeEventListener("scroll", pintar);
      window.removeEventListener("resize", pintar);
    };
  }, []);

  return (
    <header>
      <div className="wrap bar">
        <Link href="/" className="logo" aria-label="Algo Diferente, inicio">
          {/* Slot del logo: reemplazar el SVG por <Image src="/logo-algo-diferente.png" …>
              en cuanto se agregue el archivo real en public/. */}
          <svg
            viewBox="0 0 32 32"
            width={30}
            height={30}
            role="img"
            aria-label="Algo Diferente"
            className="logomark"
          >
            <circle cx="16" cy="16" r="15" fill="#141416" stroke="var(--fire)" strokeWidth="1.5" />
            <path
              d="M16 6c3.4 4 5.5 6.7 5.5 9.9A5.5 5.5 0 0 1 16 21.4a5.5 5.5 0 0 1-5.5-5.5C10.5 12.7 12.6 10 16 6z"
              fill="var(--fire)"
            />
            <path
              d="M16 13.5c1.7 2 2.7 3.3 2.7 4.7A2.7 2.7 0 0 1 16 21a2.7 2.7 0 0 1-2.7-2.8c0-1.4 1-2.7 2.7-4.7z"
              fill="#ffd27a"
            />
          </svg>
          <span>ALGO DIFERENTE</span>
        </Link>
        <nav>
          <Link href="/#especiales">Especiales</Link>
          <Link href="/menu">Menú</Link>
          <Link href="/#como">Cómo pedir</Link>
          {/* Placeholder: sustituir por el Instagram real de la cadena. */}
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <button
            type="button"
            className="cartbtn"
            onClick={abrir}
            data-cart-target
            aria-label={`Abrir pedido, ${cantidadTotal} productos`}
          >
            Mi pedido <b>{cantidadTotal}</b>
          </button>
        </nav>
      </div>
      <div className="progress" ref={progreso} />
    </header>
  );
}

export default Header;
