// Animated Smile Shopping logo, used by the start-up splash and the page-change loading screen.
export default function LogoLoader({ label = 'Loading' }) {
  return (
    <div className="ldr" role="status" aria-label={label}>
      <div className="ldr-bird"><img src="/bird.webp" alt="" width="92" height="84" /></div>
      <img className="ldr-word" src="/word.webp" alt="Smile Shopping" width="189" height="17" />
      <span className="ldr-bar" aria-hidden="true"><i /></span>
    </div>
  );
}
