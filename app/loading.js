import LogoLoader from '@/components/LogoLoader';

// Shown while the next page loads when moving between pages.
export default function Loading() {
  return <section className="page-ldr"><LogoLoader /></section>;
}
