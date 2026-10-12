/* Fires Meta Pixel + GA events if they are installed. */
export function track(event, data) {
  if (typeof window === 'undefined') return;
  try { window.fbq?.('track', event, data); } catch {}
  try { window.gtag?.('event', event, data); } catch {}
}
