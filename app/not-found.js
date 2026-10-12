import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="wrap">
      <div className="empty" style={{ padding: '80px 0' }}>
        <img src="/bird.webp" alt="" width="120" style={{ display: 'block', margin: '0 auto 12px' }} />
        <b>This page doesn&apos;t exist</b>
        It may have been moved. Head back to the shop to keep browsing.<br /><br />
        <Link className="btn btn-brand" href="/shop">Go to shop</Link>
      </div>
    </section>
  );
}
