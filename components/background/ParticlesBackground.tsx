"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0 (longe) a 1 (perto) — controla tamanho e opacidade
};

const CONNECTION_DISTANCE = 120;
const MOUSE_INTERACTION_DISTANCE = 140;
const MAX_DPR = 2;

function getParticleCount(width: number): number {
  if (width < 640) return 22; // mobile
  if (width < 1024) return 45; // tablet
  return 90; // desktop
}

function getThemeColors() {
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  // Light: tons mais escuros/saturados para manter contraste sobre fundo
  // claro — nunca o mesmo cyan claro usado no dark.
  return isLight
    ? { particle: "8, 116, 144", line: "8, 116, 144" }
    : { particle: "103, 232, 249", line: "103, 232, 249" };
}

// Fundo de partículas interativo e reutilizável — Canvas puro, sem
// dependências novas. Fica atrás do conteúdo (pointer-events-none) e
// reage ao cursor movendo-se sobre o elemento pai.
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;

    // Aliases não-nulos — o TypeScript não propaga o narrowing de
    // canvasRef.current/getContext() para dentro das funções aninhadas
    // abaixo, mesmo sendo const.
    const canvas = canvasEl;
    const ctx = ctxEl;
    const parent = canvas.parentElement;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animationFrame = 0;
    let colors = getThemeColors();
    const mouse = { x: -9999, y: -9999, active: false };

    function seedParticles() {
      const count = getParticleCount(width);
      particles = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          depth,
        };
      });
    }

    function resize() {
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      seedParticles();
    }

    function drawParticle(p: Particle) {
      const radius = 0.5 + p.depth * 1.3;
      ctx.globalAlpha = 0.25 + p.depth * 0.45;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colors.particle}, 1)`;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.strokeStyle = `rgba(${colors.line}, ${(1 - dist / CONNECTION_DISTANCE) * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function drawStaticFrame() {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) drawParticle(p);
      drawConnections();
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_INTERACTION_DISTANCE && dist > 0.01) {
            const force = (1 - dist / MOUSE_INTERACTION_DISTANCE) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Amortecimento leve — evita que a velocidade cresça indefinidamente.
        p.vx *= 0.98;
        p.vy *= 0.98;

        drawParticle(p);
      }

      drawConnections();
      animationFrame = requestAnimationFrame(step);
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    const themeObserver = new MutationObserver(() => {
      colors = getThemeColors();
      if (prefersReducedMotion) drawStaticFrame();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    window.addEventListener("resize", resize);

    if (prefersReducedMotion) {
      drawStaticFrame();
    } else {
      parent?.addEventListener("mousemove", handleMouseMove);
      parent?.addEventListener("mouseleave", handleMouseLeave);
      animationFrame = requestAnimationFrame(step);
    }

    return () => {
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    />
  );
}
