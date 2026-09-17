import { Link } from 'react-router-dom'
import { SiteLayout } from '../site/SiteLayout'

export function NotFoundPage() {
  return (
    <SiteLayout>
      <main id="main" className="not-found">
        <div className="container">
          <p className="kicker">404</p>
          <h1>This page isn’t on the map.</h1>
          <p className="lead" style={{ marginLeft: 0 }}>
            The public Chapter99 site is Home, Pricing, and the free toolkit. This URL isn’t one of
            those pages.
          </p>
          <div className="actions">
            <Link className="btn primary" to="/">
              Back to home
            </Link>
            <Link className="btn secondary" to="/pricing">
              Packages & Pricing
            </Link>
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}
