"use client";

import Image from "next/image";
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
        <Link href="/" className="logo" aria-label="Ávila Planet, inicio">
          <Image
            src="/avatarila-logo.jpg"
            alt=""
            width={30}
            height={30}
            unoptimized
            priority
          />
          <span>ÁVILA PLANET</span>
        </Link>
        <nav>
          <Link href="/#planetas">Planetas</Link>
          <Link href="/menu">Menú</Link>
          <Link href="/#como">Cómo pedir</Link>
          <a
            href="https://www.instagram.com/avilaplanet/"
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
