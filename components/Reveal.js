'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Fades/slides in every element marked data-rv as it scrolls into view.
// The hidden state only applies once html.rv-on is set here, so the page is fully visible without JS.
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('rv-on');
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const t = setTimeout(() => document.querySelectorAll('[data-rv]:not(.in)').forEach(el => io.observe(el)), 30);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return null;
}
