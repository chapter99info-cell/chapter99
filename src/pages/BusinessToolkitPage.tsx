import { CheckSquare, FileText, Globe, HelpCircle, Home, Image as ImageIcon, LayoutGrid, Lightbulb, List, MessageSquare, Settings, Sparkles, Store, Video } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dock } from '../components/ui/dock'
import { CONTACT_EMAIL } from '../data/pricing'
import {
  checklistItems,
  documentTemplates,
  legalTemplateNote,
  messagePurposes,
  navItems,
  photoSlots,
  surchargeNotice,
  tipPool,
  toolkitDisclaimer,
} from '../data/toolkit'
import { generateCustomerMessage, generateDocument, generateTip } from '../lib/generateCopy'
import {
  compressImage,
  deriveChecklist,
  loadToolkit,
  saveToolkit,
  type ToolkitPhoto,
  type ToolkitService,
  type ToolkitState,
} from '../lib/toolkitStore'

const sections = ['home', 'tools', 'messages', 'docs', 'services', 'website', 'photos', 'checklist', 'tips', 'videos', 'settings'] as const
type Section = (typeof sections)[number]

function uid() {
  return crypto.randomUUID()
}

function copyText(text: string) {
  return navigator.clipboard.writeText(text)
}

function FieldHint({ children }: { children: string }) {
  return <p className="field-hint">{children}</p>
}

const waveIcons = [Store, List, Globe, Sparkles] as const
const waveLines = {
  th: ['กำลังเตรียมข้อมูลร้าน…', 'กำลังจัดบริการและราคา…', 'กำลังประกอบตัวอย่างเว็บ…'],
  en: ['Preparing shop details…', 'Sorting services and prices…', 'Building the website preview…'],
}

function StepWave({ th }: { th: boolean }) {
  const [index, setIndex] = useState(0)
  const [motion, setMotion] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setMotion(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!motion) return
    const id = window.setInterval(() => setIndex((n) => (n + 1) % 3), 2200)
    return () => window.clearInterval(id)
  }, [motion])

  const lines = th ? waveLines.th : waveLines.en

  return (
    <div className="step-wave" aria-live="polite">
      <div className="step-wave-icons">
        {waveIcons.map((Icon, i) => (
          <span key={i} className="step-wave-dot" style={{ animationDelay: `${i * 0.12}s` }}>
            <Icon strokeWidth={1.8} aria-hidden="true" />
          </span>
        ))}
      </div>
      <p className="step-wave-status">{lines[index]}</p>
    </div>
  )
}

export function BusinessToolkitPage() {
  const location = useLocation()
  const [state, setState] = useState<ToolkitState>(() => loadToolkit())
  const [panel, setPanel] = useState<Section>('home')
  const [draft, setDraft] = useState('')
  const [purpose, setPurpose] = useState<(typeof messagePurposes)[number]['id']>('confirm')
  const [docId, setDocId] = useState<(typeof documentTemplates)[number]['id']>('cancel')
  const [status, setStatus] = useState('')
  const [tipIndex, setTipIndex] = useState(0)
  const [extra, setExtra] = useState('')
  const [previewPhoto, setPreviewPhoto] = useState<ToolkitPhoto | null>(null)
  const th = state.lang === 'th'

  useEffect(() => {
    saveToolkit(state)
  }, [state])

  useEffect(() => {
    const hash = location.hash.replace('#', '') as Section
    if (sections.includes(hash)) setPanel(hash)
  }, [location.hash])

  const checks = useMemo(() => deriveChecklist(state), [state])
  const done = Object.values(checks).filter(Boolean).length
  const pct = Math.round((done / checklistItems.length) * 100)
  const mainPhoto = state.photos.find((p) => p.slots.includes('main')) ?? state.photos[0]
  const dockItems = useMemo(
    () =>
      navItems.map((item) => {
        const icons = {
          home: Home,
          tools: LayoutGrid,
          services: List,
          website: Globe,
          docs: FileText,
          photos: ImageIcon,
          settings: Settings,
          help: HelpCircle,
        }
        const current =
          item.id === 'home'
            ? panel === 'home'
            : item.id === 'tools'
              ? panel === 'tools'
              : panel === item.id
        return {
          id: item.id,
          label: th ? item.th : item.en,
          icon: icons[item.id],
          current,
          href: item.id === 'help' ? item.to : undefined,
          onSelect:
            item.id === 'help'
              ? undefined
              : () => go((item.to.split('#')[1] ?? 'home') as Section),
        }
      }),
    [panel, th],
  )

  function go(id: Section) {
    setPanel(id)
    window.history.replaceState(null, '', `/business-toolkit#${id}`)
  }

  function t(a: string, b: string) {
    return th ? a : b
  }

  function onUpload(files: FileList | null) {
    if (!files?.length) return
    const room = Math.max(0, 8 - state.photos.length)
    void Promise.all([...files].slice(0, room).map((file) => compressImage(file))).then((urls) => {
      const next: ToolkitPhoto[] = urls.map((dataUrl, i) => ({
        id: uid(),
        name: files[i].name,
        dataUrl,
        slots: ['gallery'],
      }))
      setState((s) => ({ ...s, photos: [...s.photos, ...next] }))
      setStatus(t('บีบอัดรูปแล้ว เก็บในเครื่องนี้เท่านั้น', 'Images compressed and stored on this device only'))
    })
  }

  function addService(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const item: ToolkitService = {
      id: uid(),
      name: String(data.get('name') ?? '').trim(),
      duration: String(data.get('duration') ?? '').trim(),
      price: String(data.get('price') ?? '').trim(),
      description: String(data.get('description') ?? '').trim(),
      photoId: String(data.get('photoId') ?? ''),
    }
    if (!item.name) return
    setState((s) => ({ ...s, services: [...s.services, item] }))
    e.currentTarget.reset()
  }

  async function copyDraft() {
    const text = draft || generateDocument(docId, state.profile)
    if (!text) return
    await copyText(text)
    setStatus(t('คัดลอกแล้ว ส่งจากแอปของคุณเอง', 'Copied. Send it from your own app.'))
  }

  function smsHref() {
    return `sms:?body=${encodeURIComponent(draft)}`
  }

  return (
    <div className="toolkit">
      <div className="toolkit-toolbar">
        <div>
          <p className="eyebrow">FREE BUSINESS TOOLKIT</p>
          <strong>{state.profile.name || t('ร้านตัวอย่างบนเครื่องนี้', 'Shop preview on this device')}</strong>
        </div>
        <div className="lang-switch" role="group" aria-label="Language">
          <button type="button" aria-pressed={th} onClick={() => setState((s) => ({ ...s, lang: 'th' }))}>
            TH
          </button>
          <button type="button" aria-pressed={!th} onClick={() => setState((s) => ({ ...s, lang: 'en' }))}>
            EN
          </button>
        </div>
      </div>

      <div className="toolkit-shell">
        <div className="toolkit-main">
          {panel === 'home' || panel === 'tools' ? (
            <>
              <section className="toolkit-model" id="tools">
                <div className="toolkit-model-copy">
                  <p className="eyebrow">OUR MODEL</p>
                  <h1>{t('วิธีที่เราช่วยร้าน', 'How we help the shop')}</h1>
                  <p>
                    {t(
                      'เครื่องมือฟรีที่ช่วยให้ธุรกิจของคุณทำงานง่ายขึ้น ไม่ต้องเก่งคอม ก็ใช้งานได้ง่าย',
                      'Free tools that keep shop work simple. You do not need to be technical.',
                    )}
                  </p>
                  <p className="note">{toolkitDisclaimer}</p>
                  <button className="btn" type="button" onClick={() => go('settings')}>
                    {t('เริ่มใช้งานฟรี', 'Start free')} ↗
                  </button>
                </div>
                <div className="toolkit-model-grid">
                  {[
                    { id: 'messages' as Section, Icon: MessageSquare, th: 'สร้างข้อความ', en: 'Write a message', body: t('แปลและร่างภาษาอังกฤษ แล้วคัดลอกไปส่งเอง', 'Draft English, then copy yourself.') },
                    { id: 'docs' as Section, Icon: FileText, th: 'สร้างเอกสาร', en: 'Documents', body: t('แม่แบบนโยบายร้าน ไม่ใช่คำปรึกษากฎหมาย', 'Shop templates. Not legal advice.') },
                    { id: 'services' as Section, Icon: List, th: 'บริการและราคา', en: 'Services and prices', body: t('เพิ่มชื่อ ระยะเวลา ราคา และรูป', 'Name, duration, price and photo.') },
                    { id: 'website' as Section, Icon: Globe, th: 'เว็บไซต์ของฉัน', en: 'My website', body: t('ดูตัวอย่างจากข้อมูลบนเครื่องนี้', 'Preview from details on this device.') },
                    { id: 'photos' as Section, Icon: ImageIcon, th: 'คลังรูปภาพ', en: 'Photo library', body: t('อัปโหลด บีบอัด แล้วเลือกใช้บนเว็บ', 'Upload, compress, then place on the site.') },
                    { id: 'checklist' as Section, Icon: CheckSquare, th: 'รายการตรวจสอบ', en: 'Business checklist', body: t(`ความพร้อม ${pct}%`, `${pct}% ready`) },
                    { id: 'tips' as Section, Icon: Lightbulb, th: 'ไอเดียและคำแนะนำ', en: 'Ideas and tips', body: t('กดเมื่อต้องการข้อความแนะนำ', 'Runs only when you tap.') },
                    { id: 'videos' as Section, Icon: Video, th: 'วิดีโอสอนใช้งาน', en: 'How-to videos', body: t('โครงสำหรับคลิปในอนาคต', 'Placeholder for future clips.') },
                  ].map((card) => (
                    <button type="button" className="toolkit-model-card" key={card.id} onClick={() => go(card.id)}>
                      <span className="toolkit-model-icon" aria-hidden="true">
                        <card.Icon strokeWidth={1.8} />
                      </span>
                      <strong>{th ? card.th : card.en}</strong>
                      <span>{card.body}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="toolkit-steps">
                <h2>{t('เริ่มต้นใช้งานง่าย ๆ ใน 3 ขั้นตอน', 'Start in three steps')}</h2>
                <StepWave th={th} />
                <ol>
                  <li>
                    <button type="button" onClick={() => go('settings')}>
                      1 · {t('กรอกข้อมูลร้าน', 'Add shop details')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => go('services')}>
                      2 · {t('เพิ่มบริการและราคา', 'Add services and prices')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => go('website')}>
                      3 · {t('สร้างเว็บไซต์', 'Preview website')}
                    </button>
                  </li>
                </ol>
              </section>
            </>
          ) : null}

          {panel === 'messages' ? (
            <section>
              <h2>{t('สร้างข้อความสำหรับลูกค้า', 'Customer message')}</h2>
              <p className="note">{t('กดสร้างเมื่อพร้อม คัดลอกแล้วส่งจากแอปข้อความของคุณ เราไม่ออกค่า SMS', 'Generate on tap. Copy and send from your own app. We do not pay for SMS.')}</p>
              <label>
                {t('จุดประสงค์', 'Purpose')}
                <select value={purpose} onChange={(e) => setPurpose(e.target.value as typeof purpose)}>
                  {messagePurposes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {th ? p.th : p.en}
                    </option>
                  ))}
                </select>
                <FieldHint>{t('เลือกชนิดข้อความที่จะคัดลอกไปส่งลูกค้า', 'Choose the kind of message to copy and send.')}</FieldHint>
              </label>
              <label>
                {t('บันทึกจากร้าน', 'Shop note')}
                <textarea rows={3} value={extra} onChange={(e) => setExtra(e.target.value)} />
                <FieldHint>{t('ใส่หมายเหตุร้านได้ ไม่ใส่ชื่อหรือเบอร์ลูกค้า', 'Shop notes only. Do not add a customer name or number.')}</FieldHint>
              </label>
              <div className="actions">
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setDraft(generateCustomerMessage(purpose, state.profile, extra))
                    setStatus(t('สร้างบนเครื่องนี้แล้ว ไม่เรียกเซิร์ฟเวอร์ภายนอก', 'Created on this device. No external AI call.'))
                  }}
                >
                  {t('สร้างข้อความ', 'Generate')}
                </button>
              </div>
              <textarea readOnly rows={8} value={draft} aria-label={t('ข้อความที่สร้างแล้ว', 'Generated message')} />
              <FieldHint>{t('ข้อความภาษาอังกฤษ คัดลอกไปส่งจากแอปของคุณเอง', 'English text to copy and send from your own app.')}</FieldHint>
              <div className="actions">
                <button className="btn" type="button" onClick={() => void copyDraft()}>
                  {t('คัดลอก', 'Copy')}
                </button>
                <a className="btn small" href={smsHref()}>
                  {t('คัดลอกและเปิดแอป SMS', 'Open SMS app')}
                </a>
              </div>
            </section>
          ) : null}

          {panel === 'docs' ? (
            <section>
              <h2>{t('เอกสารและเทมเพลต', 'Documents')}</h2>
              <p className="note">{legalTemplateNote}</p>
              <div className="toolkit-cards compact">
                {documentTemplates.map((doc) => (
                  <article key={doc.id}>
                    <h3>{th ? doc.th : doc.en}</h3>
                    <button
                      className="btn small"
                      type="button"
                      onClick={() => {
                        setDocId(doc.id)
                        setDraft(generateDocument(doc.id, state.profile))
                        setState((s) => ({ ...s, checklist: { ...s.checklist, policy: true } }))
                      }}
                    >
                      {t('ใช้งาน', 'Use')}
                    </button>
                  </article>
                ))}
              </div>
              <textarea readOnly rows={10} value={draft || generateDocument(docId, state.profile)} aria-label={t('เอกสารที่สร้างแล้ว', 'Generated document')} />
              <FieldHint>{t('กดใช้งานการ์ดด้านบน แล้วคัดลอกไปวางในร้าน', 'Tap a card above, then copy this text into your shop.')}</FieldHint>
              <button className="btn" type="button" onClick={() => void copyDraft()}>
                {t('คัดลอกเอกสาร', 'Copy document')}
              </button>
            </section>
          ) : null}

          {panel === 'services' ? (
            <section>
              <h2>{t('บริการและราคา', 'Services and prices')}</h2>
              <form className="toolkit-form" onSubmit={addService}>
                <label>
                  {t('ชื่อบริการ', 'Service name')}
                  <input name="name" required placeholder={t('เช่น นวดไทย', 'e.g. Thai Massage')} />
                  <FieldHint>{t('ชื่อนี้ลูกค้าจะเห็นตอนเลือกจอง เช่น นวดไทย, นวดน้ำมัน', 'Customers see this name when they book, e.g. Thai massage.')}</FieldHint>
                </label>
                <label>
                  {t('ระยะเวลา', 'Duration')}
                  <input name="duration" placeholder={t('เช่น 60 นาที', 'e.g. 60 min')} />
                  <FieldHint>{t('เวลาที่ใช้ให้บริการจริง ลูกค้าจะเห็นตอนเลือกเวลานัด', 'The real treatment time. Customers see it when picking a slot.')}</FieldHint>
                </label>
                <label>
                  {t('ราคา', 'Price')}
                  <input name="price" inputMode="numeric" placeholder={t('เช่น 80', 'e.g. 80')} />
                  <FieldHint>{t('ใส่ตัวเลขอย่างเดียว ไม่ต้องใส่ $ หรือ A$ ระบบจะใส่ให้เอง', 'Numbers only. Do not type $ or A$. The site adds that.')}</FieldHint>
                </label>
                <label>
                  {t('คำอธิบายสั้น', 'Short description')}
                  <textarea name="description" rows={2} placeholder={t('เช่น นวดเพื่อผ่อนคลาย', 'e.g. Relaxing massage')} />
                  <FieldHint>{t('อธิบายสั้นๆ ให้ลูกค้าเข้าใจง่าย ไม่บังคับกรอกก็ได้', 'A short note for customers. You can leave this blank.')}</FieldHint>
                </label>
                <label>
                  {t('รูปของบริการนี้', 'Photo for this service')}
                  <select name="photoId">
                    <option value="">{t('ไม่ผูกกับรูป', 'No photo yet')}</option>
                    {state.photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <FieldHint>{t('เลือกรูปที่จะโชว์คู่กับบริการนี้บนเว็บไซต์ ไม่บังคับ', 'Pick the photo shown with this service on the website. Optional.')}</FieldHint>
                </label>
                <button className="btn" type="submit">
                  {t('เพิ่มบริการ', 'Add service')}
                </button>
              </form>
              <ul className="toolkit-list">
                {state.services.map((svc) => (
                  <li key={svc.id}>
                    <strong>{svc.name}</strong>
                    <span>
                      {svc.duration} · {svc.price ? `A$${svc.price}` : t('ยังไม่มีราคา', 'No price')}
                    </span>
                    <button type="button" onClick={() => setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== svc.id) }))}>
                      {t('ลบ', 'Remove')}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {panel === 'website' ? (
            <section>
              <h2>{t('เว็บไซต์ของฉัน', 'My website')}</h2>
              <p className="note">{t('ตัวอย่างจากข้อมูลบนเครื่องนี้ ยังไม่ใช่เว็บไซต์ออนไลน์', 'Preview from this device. Not a live website.')}</p>
              <article className="site-preview">
                {mainPhoto ? <img src={mainPhoto.dataUrl} alt={t('รูปหลักของร้าน / รูปที่อัปโหลดบนเครื่องนี้', 'Main shop photo uploaded on this device')} /> : <div className="site-preview-empty">{t('ยังไม่มีรูปหลัก', 'No main photo yet')}</div>}
                <div>
                  <p className="eyebrow">{state.profile.type || 'LOCAL BUSINESS'}</p>
                  <h3>{state.profile.name || 'Your shop name'}</h3>
                  <p>{state.profile.about || t('กรอกเรื่องร้านที่การตั้งค่า แล้วกลับมาดูตัวอย่าง', 'Add a shop story in Settings, then return here.')}</p>
                  <ul>
                    {state.services.map((svc) => (
                      <li key={svc.id}>
                        {svc.name} — {svc.price ? `A$${svc.price}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
              <div className="actions">
                <button className="btn" type="button" onClick={() => go('photos')}>
                  {t('ดูตัวอย่างเว็บไซต์ / จัดรูป', 'Arrange photos')}
                </button>
                <Link to="/contact?need=shop">{t('ต้องการเว็บไซต์จริงให้เราสร้างให้', 'Ask us to build the live site')}</Link>
              </div>
            </section>
          ) : null}

          {panel === 'photos' ? (
            <section>
              <h2>{t('คลังรูปภาพ', 'Photo library')}</h2>
              <p className="note">{t('เก็บในเบราว์เซอร์นี้สูงสุด 8 รูป บีบอัดก่อนบันทึก ไม่ส่งขึ้นเซิร์ฟเวอร์', 'Up to 8 photos in this browser. Compressed locally. Not uploaded to a server.')}</p>
              <label className="btn">
                {t('เพิ่มรูปภาพ', 'Add photos')}
                <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
              </label>
              <FieldHint>{t('เลือกรูปจากมือถือ แตะรูปเพื่อดูใหญ่ กดป้ายเพื่อใช้บนเว็บ', 'Pick from your phone. Tap a photo to enlarge. Tap a tag to use it.')}</FieldHint>
              <div className="photo-grid">
                {state.photos.map((photo) => (
                  <article className="photo-card" key={photo.id}>
                    <button
                      type="button"
                      className="photo-thumb"
                      onClick={() => setPreviewPhoto(photo)}
                    >
                      <img src={photo.dataUrl} alt={`${photo.name} / ${t('รูปที่อัปโหลดบนเครื่องนี้ กดเพื่อดูใหญ่', 'uploaded on this device. Tap to enlarge')}`} />
                    </button>
                    <p className="photo-name" title={photo.name}>
                      {photo.name}
                    </p>
                    <div className="slot-picks">
                      {photoSlots.map((slot) => {
                        const on = photo.slots.includes(slot.id)
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            aria-pressed={on}
                            title={th ? slot.th : slot.en}
                            aria-label={th ? slot.th : slot.en}
                            onClick={() =>
                              setState((s) => ({
                                ...s,
                                photos: s.photos.map((p) =>
                                  p.id === photo.id
                                    ? {
                                        ...p,
                                        slots: on ? p.slots.filter((x) => x !== slot.id) : [...p.slots, slot.id],
                                      }
                                    : p,
                                ),
                              }))
                            }
                          >
                            {th ? slot.shortTh : slot.shortEn}
                          </button>
                        )
                      })}
                    </div>
                    <button
                      type="button"
                      className="photo-remove"
                      onClick={() => setState((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== photo.id) }))}
                    >
                      {t('ลบ', 'Remove')}
                    </button>
                  </article>
                ))}
              </div>
              {previewPhoto ? (
                <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={t('ดูรูปใหญ่', 'Larger photo')}>
                  <button type="button" className="photo-lightbox-close" onClick={() => setPreviewPhoto(null)}>
                    {t('ปิด', 'Close')}
                  </button>
                  <img src={previewPhoto.dataUrl} alt={`${previewPhoto.name} / ${t('รูปใหญ่บนเครื่องนี้', 'enlarged photo on this device')}`} />
                </div>
              ) : null}
            </section>
          ) : null}

          {panel === 'checklist' ? (
            <section>
              <h2>
                {t('รายการตรวจสอบธุรกิจ', 'Business checklist')} · {pct}%
              </h2>
              <ul className="check-list">
                {checklistItems.map((item) => (
                  <li key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.id === 'policy' ? Boolean(state.checklist.policy) : checks[item.id]}
                        onChange={() => {
                          if (item.id === 'policy') {
                            setState((s) => ({ ...s, checklist: { ...s.checklist, policy: !s.checklist.policy } }))
                          }
                        }}
                        disabled={item.id !== 'policy'}
                      />
                      {th ? item.th : item.en}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {panel === 'tips' ? (
            <section>
              <h2>{t('ไอเดียและคำแนะนำ', 'Ideas and tips')}</h2>
              <p>{generateTip(state.profile, tipIndex)}</p>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setTipIndex((n) => n + 1)
                  setStatus(t('สร้างเมื่อกดปุ่มเท่านั้น', 'Generated only when you tap.'))
                }}
              >
                {t('ขอไอเดียถัดไป', 'Next idea')}
              </button>
            </section>
          ) : null}

          {panel === 'videos' ? (
            <section>
              <h2>{t('วิดีโอสอนใช้งาน', 'How-to videos')}</h2>
              <p className="note">{t('ยังไม่มีโฮสต์วิดีโอในโปรเจกต์นี้ จึงเป็นโครงไว้ก่อน', 'This project has no video host yet, so this is a placeholder.')}</p>
              <div className="video-slot">{t('คลิปสั้น: กรอกข้อมูลร้าน / เพิ่มบริการ / คัดลอกข้อความ', 'Short clips: shop details / services / copy a message')}</div>
            </section>
          ) : null}

          {panel === 'settings' ? (
            <section>
              <h2>{t('การตั้งค่า / ข้อมูลร้าน', 'Settings / shop profile')}</h2>
              <p className="note">{t('เก็บเฉพาะข้อมูลร้านบนเครื่องนี้ ไม่เก็บรายชื่อลูกค้า', 'Only shop details on this device. No customer list.')}</p>
              {(
                [
                  ['name', t('ชื่อร้าน', 'Shop name'), t('ชื่อที่ลูกค้าเห็นบนหน้าเว็บ', 'The name customers see on your website.')],
                  ['type', t('ประเภทร้าน', 'Business type'), t('เช่น นวด สปา หรือร้านอาหาร', 'e.g. massage, spa, or restaurant.')],
                  ['phone', t('เบอร์ร้าน', 'Shop phone'), t('เบอร์ร้านสำหรับลูกค้าโทร ไม่ใช่เบอร์ลูกค้า', 'The shop number customers can call. Not a customer number.')],
                  ['address', t('ที่อยู่ร้าน', 'Shop address'), t('ที่อยู่ที่ลูกค้าจะมาตามนัด', 'The address customers use to find the shop.')],
                  ['hours', t('เวลาเปิดร้าน', 'Opening hours'), t('วันและเวลาเปิดที่ลูกค้าเห็นบนเว็บ', 'Opening days and times shown on the website.')],
                ] as const
              ).map(([key, label, hint]) => (
                <label key={key}>
                  {label}
                  <input
                    value={state.profile[key]}
                    onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, [key]: e.target.value } }))}
                  />
                  <FieldHint>{hint}</FieldHint>
                </label>
              ))}
              <label>
                {t('เรื่องร้านสำหรับเว็บ', 'Website story')}
                <textarea rows={3} value={state.profile.about} onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, about: e.target.value } }))} />
                <FieldHint>{t('ข้อความต้อนรับสั้นๆ บนหน้าแรกของร้าน', 'A short welcome on the shop homepage.')}</FieldHint>
              </label>
              <label>
                {t('โน้ตการรับชำระเงิน', 'Payment note')}
                <input value={state.profile.payNote} onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, payNote: e.target.value } }))} placeholder={t('เช่น จ่ายที่ร้าน', 'e.g. Pay in store')} />
                <FieldHint>{t('บอกลูกค้าว่าจ่ายเงินอย่างไร เช่น จ่ายที่ร้าน', 'Tell customers how to pay, e.g. pay in store.')}</FieldHint>
              </label>
            </section>
          ) : null}

          {status ? <p className="form-status">{status}</p> : null}

          <section className="toolkit-lead">
            <h2>{t('ต้องการเว็บไซต์หรือระบบธุรกิจแบบมืออาชีพ?', 'Need a live website or full shop system?')}</h2>
            <p>
              {t(
                'เราออกแบบเว็บไซต์และระบบธุรกิจให้เหมาะกับร้านคุณ ตั้งแต่เว็บไซต์ การจอง ใบเสร็จ และงานหน้าร้าน ระบบเต็มไม่ใช่หน้าเครื่องมือฟรีนี้',
                'We can design a live site and shop system. Booking, receipts and front-desk tools sit in the paid product, not this free toolkit.',
              )}
            </p>
            <Link className="btn" to="/contact?need=shop">
              {t('ให้เราช่วยสร้างให้', 'Ask us to build it')}
            </Link>
          </section>
        </div>

        <aside className="toolkit-rail">
          <article>
            <p className="eyebrow">{t('ประกาศสำคัญ', 'Notice')}</p>
            <p>{surchargeNotice}</p>
          </article>
          <article>
            <p className="eyebrow">{t('เคล็ดลับวันนี้', 'Today’s tip')}</p>
            <p>{th ? tipPool[0].th : tipPool[0].en}</p>
          </article>
          <article>
            <p className="eyebrow">{t('ต้องการความช่วยเหลือ?', 'Need help?')}</p>
            <Link className="btn small" to="/contact?need=toolkit">
              {t('แชทกับเรา / นัดคุย', 'Talk with us')}
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>{t('ส่งอีเมล', 'Email us')}</a>
            <Link to="/contact">{t('โทรหาเรา / ทิ้งเบอร์ร้าน', 'Leave your shop number')}</Link>
          </article>
        </aside>
      </div>
      <Dock items={dockItems} ariaLabel={t('เมนูเครื่องมือ', 'Toolkit menu')} />
    </div>
  )
}
