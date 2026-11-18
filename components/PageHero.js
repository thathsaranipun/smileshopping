// Full-width photo banner at the top of inner pages. The header sits see-through on top of it (data-cover).
export default function PageHero({ image, eyebrow, title, intro, pos = 'center', children }) {
  return (
    <section className="phero" data-cover>
      <div className="phero-bg" aria-hidden="true"><img src={image} alt="" style={{ objectPosition: pos }} /></div>
      <div className="wrap phero-in">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {intro && <p className="lede">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
