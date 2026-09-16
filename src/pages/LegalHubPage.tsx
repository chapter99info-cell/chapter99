import { LegalBoundaryPath } from '../components/LegalBoundaryPath'
import { LegalLayersSteps } from '../components/LegalLayersSteps'
import { LegalPolicyPath } from '../components/LegalPolicyPath'

export function LegalHubPage() {
  return (
    <article className="legal-page">
      <p className="eyebrow">LEGAL & TRUST CENTRE</p>
      <h1>
        ข้อมูลลูกค้า
        <br />
        <em>แยกชั้นให้อ่านง่าย</em>
      </h1>
      <div className="legal-hub-grid">
        <LegalBoundaryPath />
        <LegalPolicyPath />
      </div>
      <LegalLayersSteps />
    </article>
  )
}
