import { useEffect, useRef } from 'react';

// Animated black-space background with twinkling stars, drawn on a canvas.
export default function Starfield({ density = 0.00018 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function build() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(80, Math.floor(w * h * density));
      const palette = ['255,255,255', '180,220,255', '255,200,240', '200,255,235'];
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.8 + 0.3,
        phase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));
    }

    function draw(t) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.phase);
        const alpha = Math.min(1, s.baseAlpha + twinkle * 0.6);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.shadowBlur = s.r * 4 * twinkle;
        ctx.shadowColor = `rgba(${s.color},${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', build);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
