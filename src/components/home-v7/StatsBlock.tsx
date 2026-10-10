import { v7Copy } from '../../content/v7'

export function StatsBlock() {
  if (!v7Copy.stats.enabled) return null
  return (
    <section className="cover-stats" aria-label="ตัวเลข Chapter99">
      <div className="wrap stats">
        {v7Copy.stats.items.map((item) => (
          <div className="stat" key={item.label}>
            <div className="num">{item.num}</div>
            <p>{item.label}</p>
            {'note' in item && item.note ? <small>{item.note}</small> : null}
          </div>
        ))}
      </div>
    </section>
  )
}
