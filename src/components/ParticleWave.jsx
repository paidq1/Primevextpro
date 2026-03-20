import { useEffect, useRef } from 'react';

export default function ParticleWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cols = 25;
    const rows = 10;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      const w = canvas.width;
      const h = canvas.height;
      const spacX = w / (cols - 1);
      const spacY = h / (rows - 1);

      // Draw connecting lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacX;
          const wave = Math.sin(c * 0.4 + t) * 0.5 + Math.sin(r * 0.6 + t * 0.7) * 0.5;
          const y = r * spacY + wave * 18;
          const progress = c / cols;
          const rProgress = r / rows;

          // Color gradient purple → cyan
          const r1 = Math.floor(99 + (6 - 99) * progress);
          const g1 = Math.floor(102 + (182 - 102) * progress);
          const b1 = Math.floor(241 + (212 - 241) * progress);
          const alpha = 0.3 + rProgress * 0.4;
          const color = `rgba(${r1},${g1},${b1},${alpha})`;

          // Draw dot
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // Connect to next column
          if (c < cols - 1) {
            const nx = (c + 1) * spacX;
            const nwave = Math.sin((c + 1) * 0.4 + t) * 0.5 + Math.sin(r * 0.6 + t * 0.7) * 0.5;
            const ny = r * spacY + nwave * 18;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(${r1},${g1},${b1},${alpha * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          // Connect to next row
          if (r < rows - 1) {
            const ny2 = (r + 1) * spacY + (Math.sin(c * 0.4 + t) * 0.5 + Math.sin((r + 1) * 0.6 + t * 0.7) * 0.5) * 18;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, ny2);
            ctx.strokeStyle = `rgba(${r1},${g1},${b1},${alpha * 0.3})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '70px', pointerEvents: 'none', borderRadius: '0 0 10px 10px' }}
    />
  );
}
