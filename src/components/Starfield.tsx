"use client";

import { useEffect, useRef } from "react";

/**
 * Cielo estrellado de fondo (canvas). Reproduce el efecto de la landing original:
 * campo de estrellas con paralaje y estrella fugaz ocasional.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let estrellas: { x: number; y: number; z: number; p: number; c: string }[] = [];
    let disparo: { x: number; y: number; l: number } | null = null;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let proximo = 2500;
    let animacion = 0;

    function dimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      estrellas = Array.from({ length: Math.round((w * h) / 5000) }, () => {
        const r = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.9 + 0.1,
          p: Math.random() * 6.28,
          c:
            r < 0.2
              ? "255,210,150"
              : r < 0.5
                ? "205,170,255"
                : "255,255,255",
        };
      });
    }

    function alMover(e: PointerEvent) {
      tx = e.clientX / w - 0.5;
      ty = e.clientY / h - 0.5;
    }

    function marco(t: number) {
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;
      ctx!.clearRect(0, 0, w, h);

      for (const s of estrellas) {
        const x = (((s.x - mx * 50 * s.z) % w) + w) % w;
        const y =
          ((((s.y - window.scrollY * 0.15 * s.z - my * 50 * s.z) % h) + h) % h);
        const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.001 * (1 + s.z * 2) + s.p));
        ctx!.fillStyle = `rgba(${s.c},${a.toFixed(2)})`;
        ctx!.beginPath();
        ctx!.arc(x, y, s.z * 1.5, 0, 6.283);
        ctx!.fill();
      }

      if (!calm) {
        if (!disparo && t > proximo) {
          disparo = { x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, l: 0 };
          proximo = t + 4000 + Math.random() * 6000;
        }
        if (disparo) {
          disparo.x -= 14;
          disparo.y += 6;
          disparo.l += 1;
          const g = ctx!.createLinearGradient(disparo.x, disparo.y, disparo.x + 120, disparo.y - 51);
          g.addColorStop(0, "rgba(255,255,255,.95)");
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.strokeStyle = g;
          ctx!.lineWidth = 1.6;
          ctx!.beginPath();
          ctx!.moveTo(disparo.x, disparo.y);
          ctx!.lineTo(disparo.x + 120, disparo.y - 51);
          ctx!.stroke();
          if (disparo.l > 70) disparo = null;
        }
        animacion = window.requestAnimationFrame(marco);
      }
    }

    dimensionar();
    window.addEventListener("resize", dimensionar);
    window.addEventListener("pointermove", alMover);

    if (!calm) {
      animacion = window.requestAnimationFrame(marco);
    } else {
      // Sin animación: se dibuja un único cuadro estático.
      animacion = window.requestAnimationFrame(marco);
      window.cancelAnimationFrame(animacion);
      animacion = 0;
    }

    return () => {
      window.removeEventListener("resize", dimensionar);
      window.removeEventListener("pointermove", alMover);
      if (animacion) window.cancelAnimationFrame(animacion);
    };
  }, []);

  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}

export default Starfield;
