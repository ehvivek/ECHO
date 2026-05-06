'use client';

import { useEffect, useRef, useCallback } from 'react';
import { PetalParticle } from '@/types';

const PETAL_COLORS = ['#FFC0CB', '#FFB6C1', '#FF91A4', '#FFCDD5', '#FFE4E8'];

interface SakuraCanvasProps {
  eventBurst?: 'correct' | 'wrong' | 'slow' | null;
  onBurstHandled?: () => void;
}

function createPetal(canvasW: number, canvasH: number, fromCenter?: boolean): PetalParticle {
  return {
    x: fromCenter ? canvasW / 2 + (Math.random() - 0.5) * 100 : Math.random() * (canvasW * 0.4), // Left 40%
    y: fromCenter ? canvasH / 2 : Math.random() * (canvasH * 0.6), // Top 60%
    vx: fromCenter ? (Math.random() - 0.5) * 0.5 : 0.5 + Math.random() * 2, // Strong right drift
    vy: fromCenter ? (Math.random() - 0.5) * 0.5 : 0.2 + Math.random() * 0.8, // Gentle downward drift
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    size: 6 + Math.random() * 8,
    opacity: 0.4 + Math.random() * 0.5,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    swayOffset: Math.random() * Math.PI * 2,
    swayAmplitude: 0.3 + Math.random() * 0.9,
  };
}

export default function SakuraCanvas({ eventBurst, onBurstHandled }: SakuraCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<PetalParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef(0);
  const speedMultRef = useRef(1);
  const rafRef = useRef<number>(0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const MAX_PETALS = isMobile ? 25 : 60;

  const initPetals = useCallback((w: number, h: number) => {
    petalsRef.current = [];
    for (let i = 0; i < MAX_PETALS; i++) {
      const p = createPetal(w, h);
      petalsRef.current.push(p);
    }
  }, [MAX_PETALS]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (petalsRef.current.length === 0) {
        initPetals(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove);

    const drawPetal = (p: PetalParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      // inner detail
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.ellipse(0, -p.size * 0.2, p.size * 0.2, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      frameRef.current++;
      const frame = frameRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const sm = speedMultRef.current;

      for (const p of petalsRef.current) {
        p.vy += 0.02;
        p.vx = Math.sin(frame * 0.02 + p.swayOffset) * p.swayAmplitude;
        p.x += p.vx * sm;
        p.y += p.vy * sm;
        p.rotation += p.rotationSpeed * sm;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80 && dist > 0) {
          p.vx += dx * 0.003;
          p.vy += dy * 0.003;
        }

        // Respawn in tree canopy when off screen (bottom or right edge)
        if (p.y > h + 20 || p.x > w + 20 || p.y < -50 || p.x < -50) {
          p.x = Math.random() * (w * 0.4); // Left 40%
          p.y = Math.random() * (h * 0.6); // Top 60%
          p.vy = 0.2 + Math.random() * 0.8;
          p.vx = 0.5 + Math.random() * 2;
        }

        drawPetal(p);
      }

      // Decay speed multiplier back to 1
      if (speedMultRef.current > 1) {
        speedMultRef.current = Math.max(1, speedMultRef.current - 0.04);
      } else if (speedMultRef.current < 1) {
        speedMultRef.current = Math.min(1, speedMultRef.current + 0.01);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [initPetals]);

  // Handle event bursts
  useEffect(() => {
    if (!eventBurst) return;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (eventBurst === 'correct') {
      for (let i = 0; i < 30; i++) {
        petalsRef.current.push(createPetal(w, h, true));
      }
      // Trim excess after delay
      setTimeout(() => {
        while (petalsRef.current.length > MAX_PETALS) {
          petalsRef.current.shift();
        }
      }, 3000);
    } else if (eventBurst === 'wrong') {
      speedMultRef.current = 3;
      setTimeout(() => { speedMultRef.current = 1; }, 500);
    } else if (eventBurst === 'slow') {
      speedMultRef.current = 0.3;
    }

    onBurstHandled?.();
  }, [eventBurst, onBurstHandled, MAX_PETALS]);

  return <canvas ref={canvasRef} id="sakura-canvas" />;
}
