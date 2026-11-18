'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { WAIcon, SearchIcon, CartIcon, MenuIcon, ChevronIcon } from './icons';
import Drawer from './Drawer';
import { waLink } from '@/lib/format';

const SHOP = [['/shop', 'Shop all'], ['/shop?cat=kanjivaram-silk', 'Silk half sarees'], ['/shop?cat=kanchi-cotton', 'Cotton lehengas']];
const NAV = [['/', 'Home'], ['/info/about', 'About'], ['/info/how-to-order', 'How to order'], ['/info/contact', 'Contact']];
const HELP = [['/info/delivery', 'Delivery information'], ['/info/returns', 'Returns & refunds'], ['/info/about', 'About us']];

function useHere(path) {
  const cat = useSearchParams().get('cat');
  return path + (cat ? `?cat=${cat}` : '');
}

const NavLink = ({ h, l, here }) => <Link href={h} className={here === h ? 'on' : ''} aria-current={here === h ? 'page' : undefined}>{l}</Link>;

function Nav({ path }) {
  const here = useHere(path);
  const [open, setOpen] = useState(false);
  const box = useRef();
  useEffect(() => setOpen(false), [here]);
  useEffect(() => {
    if (!open) return;
    const out = e => { if (!box.current?.contains(e.target)) setOpen(false); };
    const esc = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', esc); };
  }, [open]);
  const inShop = path.startsWith('/shop');
  return (
    <nav className="nav" aria-label="Main">
      <NavLink h="/" l="Home" here={here} />
      <div className={`nav-dd ${open ? 'open' : ''}`} ref={box} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
        <button type="button" className={inShop ? 'on' : ''} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(o => !o)}>
          Shop <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div className="nav-menu">
          {SHOP.map(([h, l]) => <NavLink key={h} h={h} l={l} here={here} />)}
        </div>
      </div>
      {NAV.slice(1).map(([h, l]) => <NavLink key={h} h={h} l={l} here={here} />)}
    </nav>
  );
}

function DrawerNav({ path, count }) {
  const here = useHere(path);
  const row = ([h, l], sub) => (
    <Link key={h} href={h} className={`${here === h ? 'on' : ''} ${sub ? 'sub' : ''}`} aria-current={here === h ? 'page' : undefined}>
      {l}<ChevronIcon />
    </Link>
  );
  return (
    <>
      <nav className="drw-nav" aria-label="Mobile">
        {row(NAV[0])}
        {row(SHOP[0])}
        {SHOP.slice(1).map(x => row(x, true))}
        {NAV.slice(1).map(x => row(x))}
      </nav>
      <div className="drw-quick">
        <Link href="/shop?focus=1"><SearchIcon /> Search</Link>
        <Link href="/cart"><CartIcon /> Cart{count > 0 && <span className="drw-count">{count}</span>}</Link>
      </div>
      <p className="drw-h">Help</p>
      <nav className="drw-sub" aria-label="Help">
        {HELP.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
      </nav>
    </>
  );
}

export default function Header({ whatsapp }) {
  const { count, bump } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [clear, setClear] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const cc = useRef();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!bump || !cc.current) return;
    cc.current.classList.remove('bump'); void cc.current.offsetWidth; cc.current.classList.add('bump');
  }, [bump]);

  // Over a full-width cover image the header is see-through; it turns solid black once the page scrolls.
  useEffect(() => {
    const onScroll = () => setClear(!!document.querySelector('main > [data-cover]:first-child') && window.scrollY < 40);
    onScroll();
    const t = setTimeout(onScroll, 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
  }, [path]);

  if (path.startsWith('/admin')) return null;
  return (
    <>
      <header className={`hdr ${clear ? 'clear' : ''}`}>
        <div className="wrap hdr-in">
          <Link className="logo" href="/" aria-label="Smile Shopping home">
            <img className="bird" src="/bird.webp" alt="" width="46" height="42" />
            <img className="word" src="/word.webp" alt="Smile Shopping" width="189" height="17" />
          </Link>
          <Suspense fallback={<nav className="nav" />}><Nav path={path} /></Suspense>
          <div className="hdr-act">
            <Link className="ibtn" href="/shop?focus=1" aria-label="Search"><SearchIcon /></Link>
            <Link className="ibtn" href="/cart" aria-label="Cart">
              <CartIcon />
              <span className="cc" ref={cc} hidden={!count}>{count}</span>
            </Link>
            <a className="wa-pill" href={waLink(whatsapp, 'Hi Smile Shopping!')} target="_blank" rel="noopener" aria-label="WhatsApp us">
              <WAIcon /><span>Let&apos;s talk</span>
            </a>
            <button className="ibtn menu-btn" type="button" aria-label="Open menu" aria-controls="site-menu" aria-expanded={open} onClick={() => setOpen(true)}><MenuIcon /></button>
          </div>
        </div>
      </header>
      <Drawer
        id="site-menu" open={open} onClose={close} title="Menu"
        head={<Link className="logo" href="/" onClick={close}><img className="bird" src="/bird.webp" alt="" width="40" height="36" /><img className="word" src="/word.webp" alt="Smile Shopping" width="150" height="14" /></Link>}
        foot={<a className="btn btn-wa btn-block" href={waLink(whatsapp, 'Hi Smile Shopping!')} target="_blank" rel="noopener"><WAIcon /> Chat on WhatsApp</a>}
      >
        <Suspense fallback={null}><DrawerNav path={path} count={count} /></Suspense>
      </Drawer>
    </>
  );
}
