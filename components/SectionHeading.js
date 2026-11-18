// Eyebrow + heading (+ optional intro and right-hand link) used at the top of every homepage section.
export default function SectionHeading({ eyebrow, title, intro, center, aside }) {
  const cls = `sx-head${center ? ' center' : ''}${aside ? ' row' : ''}`;
  const body = (
    <>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </>
  );
  return aside
    ? <div className={cls} data-rv><div>{body}</div>{aside}</div>
    : <div className={cls} data-rv>{body}</div>;
}
