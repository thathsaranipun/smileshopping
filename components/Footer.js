'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WAIcon } from './icons';
import { waLink } from '@/lib/format';

export default function Footer({ whatsapp }) {
  const path = usePathname();
  if (path.startsWith('/admin')) return null;
  return (
    <>
      <footer className="ftr">
        <div className="plumage" />
        <div className="wrap">
          <div className="ftr-g">
            <div>
              <img className="bird" src="/bird.webp" alt="" />
              <img className="word" src="/word.webp" alt="Smile Shopping" />
              <p className="script">Srilanka&apos;s best online chain</p>
            </div>
            <div><h4>Shop</h4>
              <Link href="/shop">All products</Link><Link href="/shop?cat=home">Home &amp; Kitchen</Link>
              <Link href="/shop?cat=tech">Electronics</Link><Link href="/shop?cat=beauty">Beauty &amp; Care</Link>
              <Link href="/shop?cat=fashion">Fashion</Link><Link href="/shop?cat=kids">Kids &amp; Toys</Link>
            </div>
            <div><h4>Help</h4>
              <Link href="/info/delivery">Delivery information</Link><Link href="/info/payment">Payment information</Link>
              <Link href="/info/returns">Returns &amp; refunds</Link><Link href="/info/contact">Contact us</Link>
            </div>
            <div><h4>Company</h4>
              <Link href="/info/about">About us</Link><Link href="/info/privacy">Privacy policy</Link>
              <Link href="/info/terms">Terms &amp; conditions</Link>
            </div>
          </div>
          <div className="copy">© {new Date().getFullYear()} Smile Shopping · smileshopping.lk</div>
        </div>
      </footer>
      <a className="fwa" href={waLink(whatsapp, 'Hi Smile Shopping! I have a question.')} target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <WAIcon size={30} />
      </a>
    </>
  );
}
