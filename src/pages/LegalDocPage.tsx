import { Navigate, useParams } from 'react-router-dom'
import { LegalDocDock } from '../components/LegalDocDock'
import { LegalReadPath } from '../components/LegalReadPath'
import { LEGAL_NOTICE, LEGAL_VERSION, getLegalDoc, layerLabel } from '../data/legal'
import { SiteLayout } from '../site/SiteLayout'
import '../site/homepage-v2.css'

export function LegalDocPage() {
  const { slug } = useParams()
  const doc = slug ? getLegalDoc(slug) : undefined
  if (!doc) return <Navigate to="/legal" replace />

  return (
    <SiteLayout>
      <article className="legal-page">
        <p className="eyebrow">
          {layerLabel[doc.layer]} · {LEGAL_VERSION}
        </p>
        <h1>
          {doc.titleTh}
          <br />
          <em>{doc.titleEn}</em>
        </h1>
        <p className="lead">{doc.summary}</p>
        <p className="note">{LEGAL_NOTICE}</p>
        {doc.slug === 'terms' ? (
          <LegalReadPath
            title="สิบสี่ข้อที่ควรอ่านก่อนใช้บริการ"
            lead="ชี้ที่การ์ดเพื่ออ่านชัดขึ้น วงกลมและแสงจะตามเมาส์ไปที่ข้อนั้น"
            items={doc.sections}
          />
        ) : (
          doc.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paras.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))
        )}
        <LegalDocDock />
      </article>
    </SiteLayout>
  )
}
