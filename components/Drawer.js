'use client';
import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons';

// Slide-in side panel for mobile navigation.
// Locks page scroll while open, closes on Escape / backdrop tap, and returns focus to the opener.
export default function Drawer({ open, onClose, title, head, children, foot, id = 'drawer' }) {
  const panel = useRef();
  const opener = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!open) { root.classList.remove('drawer-open'); return; }
    opener.current = document.activeElement;
    root.classList.add('drawer-open');
    const t = setTimeout(() => panel.current?.querySelector('a, button')?.focus({ preventScroll: true }), 60);
    const key = e => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = [...panel.current.querySelectorAll('a[href], button:not([disabled])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => {
      clearTimeout(t); document.removeEventListener('keydown', key); root.classList.remove('drawer-open');
      opener.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  // Close automatically if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 901px)');
    const fn = e => e.matches && onClose();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [open, onClose]);

  const tapLink = e => { if (e.target.closest('a, [data-close]')) onClose(); };

  return (
    <div className={`drw ${open ? 'on' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="drw-bg" onClick={onClose} />
      <aside id={id} ref={panel} className="drw-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="drw-head">
          {head}
          <button type="button" className="ibtn drw-x" aria-label="Close menu" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="drw-body" onClick={tapLink}>{children}</div>
        {foot && <div className="drw-foot" onClick={tapLink}>{foot}</div>}
      </aside>
    </div>
  );
}
