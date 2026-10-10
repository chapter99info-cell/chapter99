import { v7Copy } from '../../content/v7'

export function StatsBlock() {
  if (!v7Copy.stats.enabled) return null
  return (
    <section className="cover-stats" aria-label="ตัวเลข">
      <div className="wrap stats">
        <h2 className="th2">{v7Copy.stats.headline}</h2>
        {v7Copy.stats.items.map((item) => (
          <div className="stat" key={item.label}>
            <div className="num">{item.num}</div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
