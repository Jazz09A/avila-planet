"use client";

import { useEffect, useRef } from "react";

/**
 * Brasas de fondo (canvas): partículas naranjas que ascienden desde el
 * carbón con parpadeo, paralaje con el puntero y una chispa ocasional
 * que se dispara hacia arriba. Respeta `prefers-reduced-motion`
 * dibujando un único cuadro estático.
 */
export function Brasas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let brasas: { x: number; y: number; z: number; p: number; v: number; c: string }[] = [];
    let chispa: { x: number; y: number; l: number } | null = null;
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
      brasas = Array.from({ length: Math.round((w * h) / 7000) }, () => {
        const r = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.9 + 0.1,
          p: Math.random() * 6.28,
          v: 0.15 + Math.random() * 0.4,
          c:
            r < 0.35
              ? "255,150,60"
              : r < 0.7
                ? "255,190,90"
                : "255,110,30",
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

      for (const b of brasas) {
        // Ascenso lento con deriva lateral; al salir por arriba reaparece abajo.
        if (!calm) {
          b.y -= b.v;
          b.x += Math.sin(t * 0.001 + b.p) * 0.3;
          if (b.y < -8) {
            b.y = h + 8;
            b.x = Math.random() * w;
          }
        }
        const x = (((b.x - mx * 50 * b.z) % w) + w) % w;
        const y =
          ((((b.y - window.scrollY * 0.06 * b.z - my * 50 * b.z) % h) + h) % h);
        const a = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.002 * (1 + b.z * 2) + b.p));
        ctx!.fillStyle = `rgba(${b.c},${a.toFixed(2)})`;
        ctx!.beginPath();
        ctx!.arc(x, y, b.z * 1.6, 0, 6.283);
        ctx!.fill();
      }

      if (!calm) {
        // Chispa que sube desde el carbón con una estela corta.
        if (!chispa && t > proximo) {
          chispa = { x: Math.random() * w * 0.8 + w * 0.1, y: h + 20, l: 0 };
          proximo = t + 4000 + Math.random() * 6000;
        }
        if (chispa) {
          chispa.y -= 12;
          chispa.x += 1.4;
          chispa.l += 1;
          const g = ctx!.createLinearGradient(chispa.x, chispa.y, chispa.x - 6, chispa.y + 60);
          g.addColorStop(0, "rgba(255,205,130,.95)");
          g.addColorStop(1, "rgba(255,120,30,0)");
          ctx!.strokeStyle = g;
          ctx!.lineWidth = 1.8;
          ctx!.beginPath();
          ctx!.moveTo(chispa.x, chispa.y);
          ctx!.lineTo(chispa.x - 6, chispa.y + 60);
          ctx!.stroke();
          if (chispa.l > 90 || chispa.y < -70) chispa = null;
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
      marco(0);
    }

    return () => {
      window.removeEventListener("resize", dimensionar);
      window.removeEventListener("pointermove", alMover);
      if (animacion) window.cancelAnimationFrame(animacion);
    };
  }, []);

  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}

export default Brasas;
