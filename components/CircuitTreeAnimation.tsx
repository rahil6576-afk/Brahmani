'use client';

import React, { useEffect, useRef, useState } from 'react';

// Exact terminal coordinates detected from the emblem geometry (normalized 0 to 1)
const TERMINAL_NODES = [
  { id: 1, x: 0.495, y: 0.112, order: 8 },  // Apex top
  { id: 2, x: 0.394, y: 0.157, order: 7 },  // Upper inner left
  { id: 3, x: 0.608, y: 0.157, order: 7 },  // Upper inner right
  { id: 4, x: 0.304, y: 0.222, order: 6 },  // Mid upper left
  { id: 5, x: 0.691, y: 0.225, order: 6 },  // Mid upper right
  { id: 6, x: 0.225, y: 0.281, order: 5 },  // High outer left
  { id: 7, x: 0.777, y: 0.289, order: 5 },  // High outer right
  { id: 8, x: 0.185, y: 0.387, order: 4 },  // Mid outer left
  { id: 9, x: 0.810, y: 0.388, order: 4 },  // Mid outer right
  { id: 10, x: 0.218, y: 0.485, order: 3 }, // Lower outer left
  { id: 11, x: 0.779, y: 0.484, order: 3 }, // Lower outer right
  { id: 12, x: 0.264, y: 0.577, order: 2 }, // Base branch left
  { id: 13, x: 0.734, y: 0.577, order: 2 }, // Base branch right
];

// Pairs of nodes for natural electric arcs
const ARC_PAIRS = [
  [12, 10],
  [13, 11],
  [10, 8],
  [11, 9],
  [8, 6],
  [9, 7],
  [6, 4],
  [7, 5],
  [4, 2],
  [5, 3],
  [2, 1],
  [3, 1],
];

interface CircuitTreeAnimationProps {
  className?: string;
}

export default function CircuitTreeAnimation({ className = '' }: CircuitTreeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/Golden Circuit Tree Emblem.webp';
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    const img = imageRef.current;

    // Create offscreen buffer for masked electrical effect
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    let animId: number;
    let startTime: number | null = null;
    const DURATION = 7.0; // 7.0 second seamless loop

    // Helper: generate jagged lightning arc between two points
    const drawLightningArc = (
      context: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      alpha: number
    ) => {
      if (alpha <= 0.02) return;
      context.save();
      context.beginPath();
      context.moveTo(x1, y1);

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy);
      const segments = Math.max(3, Math.floor(dist / 14));

      for (let s = 1; s < segments; s++) {
        const t = s / segments;
        const curX = x1 + dx * t;
        const curY = y1 + dy * t;
        // Perpendicular offset with jitter
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const jitter = (Math.random() - 0.5) * 8;
        context.lineTo(curX + perpX * jitter, curY + perpY * jitter);
      }
      context.lineTo(x2, y2);

      // Outer golden glow
      context.strokeStyle = `rgba(255, 193, 7, ${alpha * 0.7})`;
      context.lineWidth = 2.5;
      context.shadowColor = '#FFC107';
      context.shadowBlur = 10;
      context.stroke();

      // White-hot core
      context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
      context.lineWidth = 1;
      context.shadowBlur = 4;
      context.stroke();
      context.restore();
    };

    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const loopTime = elapsed % DURATION;
      const p = loopTime / DURATION; // 0.0 to 1.0 progress

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || 120;
      const displayHeight = canvas.clientHeight || 120;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Clear main canvas (transparent background preserved)
      ctx.clearRect(0, 0, w, h);

      // Compute centered square draw bounds preserving original emblem proportions
      const size = Math.min(w, h);
      const offsetX = (w - size) / 2;
      const offsetY = (h - size) / 2;

      // =====================================================================
      // 1. BASE PASS: Original Metallic Gold Tree (faint ambient to warm rest)
      // =====================================================================
      // Base resting brightness envelope (seamless at t=0 and t=1)
      const baseAlpha = 0.55 + 0.35 * Math.sin(p * Math.PI * 2 - Math.PI / 2 + 0.5) * 0.35;
      
      ctx.save();
      ctx.globalAlpha = Math.max(0.45, Math.min(0.95, baseAlpha));
      ctx.drawImage(img, offsetX, offsetY, size, size);
      ctx.restore();

      // =====================================================================
      // 2. MASKED ELECTRICAL CURRENT RISING FROM GROUND (Source-Atop)
      // =====================================================================
      offCtx.clearRect(0, 0, w, h);
      offCtx.drawImage(img, offsetX, offsetY, size, size);
      offCtx.save();
      offCtx.globalCompositeOperation = 'source-atop';

      // Current pulse 1: Main Rising Wave (progress 0.10 to 0.48)
      if (p >= 0.08 && p <= 0.60) {
        const waveProgress = (p - 0.08) / 0.52; // 0 to 1
        // Wave travels from roots (y: 0.92) to top terminals (y: 0.08)
        const currentY = offsetY + size * (0.94 - waveProgress * 0.90);
        const waveHeight = size * 0.38;

        const grad = offCtx.createLinearGradient(0, currentY + waveHeight, 0, currentY - waveHeight * 0.6);
        grad.addColorStop(0, 'rgba(255, 160, 0, 0)');
        grad.addColorStop(0.35, 'rgba(255, 193, 7, 0.7)');
        grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.95)'); // White-hot electric center
        grad.addColorStop(0.75, 'rgba(255, 215, 0, 0.8)');
        grad.addColorStop(1, 'rgba(255, 140, 0, 0)');

        offCtx.fillStyle = grad;
        offCtx.fillRect(offsetX, 0, size, h);
      }

      // Current pulse 2: Secondary gentle surge traveling upward (progress 0.55 to 0.82)
      if (p >= 0.52 && p <= 0.88) {
        const wave2Progress = (p - 0.52) / 0.36;
        const currentY2 = offsetY + size * (0.92 - wave2Progress * 0.86);
        const waveHeight2 = size * 0.45;

        const grad2 = offCtx.createLinearGradient(0, currentY2 + waveHeight2, 0, currentY2 - waveHeight2 * 0.5);
        grad2.addColorStop(0, 'rgba(255, 193, 7, 0)');
        grad2.addColorStop(0.5, 'rgba(255, 235, 160, 0.65)');
        grad2.addColorStop(1, 'rgba(255, 193, 7, 0)');

        offCtx.fillStyle = grad2;
        offCtx.fillRect(offsetX, 0, size, h);
      }

      // Ground energy crackling beneath roots (progress 0.02 to 0.25)
      if (p <= 0.26 || p >= 0.95) {
        const rootY = offsetY + size * 0.88;
        const groundIntensity = p >= 0.95 
          ? (p - 0.95) / 0.05 
          : 1.0 - (p / 0.26);
        
        const groundGrad = offCtx.createLinearGradient(0, rootY + size * 0.12, 0, rootY - size * 0.05);
        groundGrad.addColorStop(0, `rgba(255, 255, 255, ${groundIntensity * 0.85})`);
        groundGrad.addColorStop(0.4, `rgba(255, 193, 7, ${groundIntensity * 0.7})`);
        groundGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');

        offCtx.fillStyle = groundGrad;
        offCtx.fillRect(offsetX, rootY - size * 0.05, size, size * 0.18);
      }

      offCtx.restore();

      // Composite masked electric pulses onto main canvas with bloom
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(offCanvas, 0, 0);
      ctx.restore();

      // =====================================================================
      // 3. CENTRAL LIGHTNING BOLT FLASH (High intensity electric discharge)
      // =====================================================================
      const boltX = offsetX + size * 0.50;
      const boltY = offsetY + size * 0.44;

      if (p >= 0.24 && p <= 0.46) {
        const boltProgress = (p - 0.24) / 0.22;
        // Rapid strobe envelope
        const boltPulse = Math.sin(boltProgress * Math.PI);
        const strobe = 0.8 + 0.2 * Math.sin(elapsed * 55);
        const boltIntensity = boltPulse * strobe;

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        
        // Intense, tight radial flare directly on the bolt
        const boltGrad = ctx.createRadialGradient(boltX, boltY, 1, boltX, boltY, size * 0.12);
        boltGrad.addColorStop(0, `rgba(255, 255, 255, ${boltIntensity * 0.95})`);
        boltGrad.addColorStop(0.3, `rgba(255, 220, 80, ${boltIntensity * 0.75})`);
        boltGrad.addColorStop(0.7, `rgba(255, 160, 0, ${boltIntensity * 0.3})`);
        boltGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');

        ctx.fillStyle = boltGrad;
        ctx.beginPath();
        ctx.arc(boltX, boltY, size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Micro spark filaments radiating from lightning bolt
        if (boltIntensity > 0.4) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${boltIntensity * 0.8})`;
          ctx.lineWidth = 1.5;
          for (let a = 0; a < 4; a++) {
            const angle = (a * Math.PI) / 2 + Math.sin(elapsed * 20 + a) * 0.5;
            const r = size * 0.08 + Math.random() * size * 0.04;
            ctx.beginPath();
            ctx.moveTo(boltX, boltY);
            ctx.lineTo(boltX + Math.cos(angle) * r, boltY + Math.sin(angle) * r);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      // =====================================================================
      // 4. SEQUENTIAL TERMINAL NODES ILLUMINATION (Wave of energy to terminals)
      // =====================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      TERMINAL_NODES.forEach((node) => {
        const nx = offsetX + size * node.x;
        const ny = offsetY + size * node.y;

        // Wave triggers nodes from lower branches (order 2) to top (order 8)
        const triggerP = 0.20 + (node.order / 8) * 0.28; // 0.27 to 0.48
        const nodeAge = p - triggerP;

        let nodeGlow = 0;
        if (nodeAge >= 0 && nodeAge <= 0.42) {
          // Sharp attack, sustained warm bloom, smooth decay
          const normAge = nodeAge / 0.42;
          nodeGlow = Math.sin(normAge * Math.PI) * (0.8 + 0.2 * Math.sin(elapsed * 12 + node.id));
        }

        // Secondary pulse pass across all nodes together
        if (p >= 0.62 && p <= 0.85) {
          const allPulse = Math.sin(((p - 0.62) / 0.23) * Math.PI) * 0.45;
          nodeGlow = Math.max(nodeGlow, allPulse);
        }

        if (nodeGlow > 0.02) {
          const radius = size * 0.032;
          const nodeGrad = ctx.createRadialGradient(nx, ny, 1, nx, ny, radius);
          nodeGrad.addColorStop(0, `rgba(255, 255, 255, ${nodeGlow * 0.98})`);
          nodeGrad.addColorStop(0.3, `rgba(255, 215, 60, ${nodeGlow * 0.85})`);
          nodeGrad.addColorStop(0.7, `rgba(255, 160, 0, ${nodeGlow * 0.4})`);
          nodeGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');

          ctx.fillStyle = nodeGrad;
          ctx.beginPath();
          ctx.arc(nx, ny, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // =====================================================================
      // 5. NATURAL ELECTRIC ARCS JUMPING BETWEEN ADJACENT CIRCUIT NODES
      // =====================================================================
      if (p >= 0.32 && p <= 0.62) {
        const arcProgress = (p - 0.32) / 0.30;
        const arcEnvelope = Math.sin(arcProgress * Math.PI);

        // Pick active pairs intermittently based on time
        ARC_PAIRS.forEach((pair, idx) => {
          const tSlot = (elapsed * 4 + idx * 0.6) % 1;
          if (tSlot < 0.35) { // Active in short realistic bursts
            const nodeA = TERMINAL_NODES.find((n) => n.id === pair[0]);
            const nodeB = TERMINAL_NODES.find((n) => n.id === pair[1]);
            if (nodeA && nodeB) {
              const ax = offsetX + size * nodeA.x;
              const ay = offsetY + size * nodeA.y;
              const bx = offsetX + size * nodeB.x;
              const by = offsetY + size * nodeB.y;
              drawLightningArc(ctx, ax, ay, bx, by, arcEnvelope * 0.75);
            }
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [imageLoaded]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* High-Performance Canvas Animation without outer glow halo */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain relative z-10"
        style={{ imageRendering: 'auto' }}
        aria-label="Golden Circuit Tree Emblem - Animated with rising electrical energy"
      />
    </div>
  );
}
