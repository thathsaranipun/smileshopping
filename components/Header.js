'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { WAIcon, SearchIcon, CartIcon, MenuIcon } from './icons';
import { waLink } from '@/lib/format';

const NAV = [
  ['/shop', 'Shop all'], ['/shop?cat=home', 'Home'], ['/shop?cat=tech', 'Electronics'],
  ['/shop?cat=beauty', 'Beauty'], ['/info/delivery', 'Delivery'], ['/info/contact', 'Contact'],
];

export default function Header({ whatsapp }) {
  const { count, bump } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const cc = useRef();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => { document.documentElement.classList.toggle('menu-open', open); }, [open]);
  useEffect(() => {
    if (!bump || !cc.current) return;
    cc.current.classList.remove('bump'); void cc.current.offsetWidth; cc.current.classList.add('bump');
  }, [bump]);

  if (path.startsWith('/admin')) return null;
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <Link className="logo" href="/" aria-label="Smile Shopping home">
          <img className="bird" src="/bird.webp" alt="" width="52" height="47" />
          <img className="word" src="/word.webp" alt="Smile Shopping" width="211" height="19" />
        </Link>
        <nav className="nav">
          {NAV.map(([h, l]) => <Link key={h} href={h} className={path === h ? 'on' : ''}>{l}</Link>)}
        </nav>
        <div className="hdr-act">
          <Link className="ibtn" href="/shop?focus=1" aria-label="Search"><SearchIcon /></Link>
          <a className="wa-pill" href={waLink(whatsapp, 'Hi Smile Shopping!')} target="_blank" rel="noopener" aria-label="WhatsApp us">
            <WAIcon /><span>WhatsApp</span>
          </a>
          <Link className="ibtn" href="/cart" aria-label="Cart">
            <CartIcon />
            <span className="cc" ref={cc} hidden={!count}>{count}</span>
          </Link>
          <button className="ibtn menu-btn" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(o => !o)}><MenuIcon /></button>
        </div>
      </div>
    </header>
  );
}
