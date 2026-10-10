import { v7Copy } from '../../content/v7'

export function ClientStrip() {
  return (
    <section className="cover-logos" aria-label="ลูกค้าของเรา">
      <div className="wrap logos">
        <span className="kicker">ลูกค้าของเรา</span>
        {v7Copy.clients.map((name) => (
          <span className="l" key={name}>
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
