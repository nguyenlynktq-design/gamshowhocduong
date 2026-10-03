import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

export interface ConfettiRef {
  trigger: (count?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  opacity: number;
  gravity: number;
  drag: number;
  isSparkle: boolean;
}

export const ConfettiCanvas = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const trigger = (particleCount = 120) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00F0FF', '#FFD700', '#10B981', '#FF4D6D', '#FFB703', '#A78BFA', '#FFFFFF'];
    const origins = [
      { x: canvas.width * 0.25, y: canvas.height * 0.35 },
      { x: canvas.width * 0.5, y: canvas.height * 0.25 },
      { x: canvas.width * 0.75, y: canvas.height * 0.35 }
    ];

    origins.forEach((origin) => {
      const countPerOrigin = Math.floor(particleCount / origins.length);
      for (let i = 0; i < countPerOrigin; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 3;
        particlesRef.current.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 7 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 12,
          opacity: 1,
          gravity: 0.22,
          drag: 0.965,
          isSparkle: Math.random() > 0.4
        });
      }
    });

    // Confetti streamers from the top
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        opacity: 1,
        gravity: 0.08,
        drag: 0.99,
        isSparkle: false
      });
    }

    if (!animFrameRef.current) {
      animate();
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.vRot;
      p.opacity -= 0.011;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.isSparkle) {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.4, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.4, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
        }

        ctx.restore();
      }
    });

    particlesRef.current = particlesRef.current.filter((p) => p.opacity > 0);

    if (alive) {
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrameRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    trigger
  }));

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-50 pointer-events-none"
    />
  );
});

ConfettiCanvas.displayName = 'ConfettiCanvas';
