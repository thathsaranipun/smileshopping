'use client';
import { useEffect, useRef, useState } from 'react';

// Number that counts up from 0 the first time it scrolls into view.
export default function StatCounter({ value, suffix = '', label, duration = 1600 }) {
  const ref = useRef();
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return (
    <div className="stat" ref={ref}>
      <b>{n.toLocaleString('en-US')}{suffix && <sup>{suffix}</sup>}</b>
      <span>{label}</span>
    </div>
  );
}
