'use client';
import Link from 'next/link';
import { WAIcon, CartIcon } from './icons';
import { useCart } from './CartProvider';
import { waLink, prettyPhone } from '@/lib/format';
import { SITE } from '@/data/site';

export default function Footer({ whatsapp }) {
  const { count } = useCart();
  const hi = waLink(whatsapp, 'Hi Smile Shopping!');
  return (
    <>
      <footer className="ftr">
        <div className="wrap">
          <div className="ftr-g">
            <div>
              <img className="bird" src="/images/brand/bird.webp" alt="" />
              <img className="word" src="/images/brand/word.webp" alt="Smile Shopping" />
              <p className="blurb">Kanjivaram silk half sarees and South-style Kanchi cotton lehengas, in ready stock and delivered to every district in Sri Lanka. Order in one WhatsApp message.</p>
              <a className="btn btn-light" href={hi} target="_blank" rel="noopener"><WAIcon /> Order on WhatsApp</a>
            </div>
            <div><h4>Shop</h4>
              <Link href="/shop">All products</Link>
              <Link href="/shop?cat=kanjivaram-silk">Kanjivaram silk half sarees</Link>
              <Link href="/shop?cat=kanchi-cotton">Kanchi cotton lehengas</Link>
              <Link href="/cart">Your cart</Link>
            </div>
            <div><h4>Help</h4>
              <Link href="/info/how-to-order">How to order</Link>
              <Link href="/info/delivery">Delivery information</Link>
              <Link href="/info/returns">Returns &amp; refunds</Link>
              <Link href="/info/about">About us</Link>
              <Link href="/info/privacy">Privacy policy</Link>
              <Link href="/info/terms">Terms &amp; conditions</Link>
            </div>
            <div className="contact"><h4>Contact</h4>
              <a href={hi} target="_blank" rel="noopener">WhatsApp: {prettyPhone(whatsapp)}</a>
              <a href={`tel:+${whatsapp}`}>Call: {prettyPhone(whatsapp)}</a>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              <span>{SITE.hours}</span>
              <div className="socials">
                <a href={hi} target="_blank" rel="noopener" aria-label="WhatsApp"><WAIcon size={18} /></a>
                <a href={`tel:+${whatsapp}`} aria-label="Call us">
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="copy"><span>© {new Date().getFullYear()} Smile Shopping · smileshopping.lk</span><span>Island-wide delivery · Sri Lanka</span><span className="dev">Developed by <a href={SITE.developer.url} target="_blank" rel="noopener">{SITE.developer.name}</a></span></div>
        </div>
      </footer>

      <div className="mbar">
        <Link className="btn btn-line" href="/cart"><CartIcon /> Cart{count > 0 ? ` (${count})` : ''}</Link>
        <a className="btn btn-wa" href={waLink(whatsapp, 'Hi Smile Shopping! I would like to order.')} target="_blank" rel="noopener"><WAIcon /> Order on WhatsApp</a>
      </div>
      <a className="fwa" href={waLink(whatsapp, 'Hi Smile Shopping! I have a question.')} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <WAIcon size={30} />
      </a>
    </>
  );
}
