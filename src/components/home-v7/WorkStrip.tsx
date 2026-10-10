import { v7Copy } from '../../content/v7'

export function WorkStrip() {
  return (
    <section className="cover-work" aria-label="ผลงานจริง">
      <div className="strip" id="work">
        {v7Copy.works.map((work) => (
          <article className="work" key={work.src}>
            <img className="shot" src={work.src} alt={work.alt} width={680} height={906} loading="lazy" />
            <div className="meta">
              <b>{work.title}</b>
              <span>{work.tag}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
