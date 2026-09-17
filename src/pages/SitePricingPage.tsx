import { useEffect } from 'react'
import { PackagesPricing } from '../cinematic/components/PackagesPricing'
import { SiteLayout } from '../site/SiteLayout'

export function SitePricingPage() {
  useEffect(() => {
    document.title = 'Chapter99 — Packages & Pricing'
  }, [])

  return (
    <SiteLayout>
      <div className="site-pricing">
        <PackagesPricing />
      </div>
    </SiteLayout>
  )
}
