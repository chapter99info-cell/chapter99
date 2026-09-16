import { Bell, CalendarClock, FileText, HelpCircle, Home, LayoutGrid, MessageSquare, Settings, Sparkles, Star, Store, Users } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dock } from '../components/ui/dock'
import { ToolkitDailyPanels } from '../components/ToolkitDailyPanels'
import { CONTACT_EMAIL } from '../data/pricing'
import {
  documentTemplates,
  legalTemplateNote,
  messagePurposes,
  navItems,
  surchargeNotice,
  tipPool,
  toolkitDisclaimer,
} from '../data/toolkit'
import { generateCustomerMessage, generateDocument } from '../lib/generateCopy'
import { loadToolkit, saveToolkit, type ToolkitState } from '../lib/toolkitStore'

const sections = ['home', 'tools', 'messages', 'docs', 'settings', 'queue', 'guests', 'reminders', 'reviews'] as const
type Section = (typeof sections)[number]

function copyText(text: string) {
  return navigator.clipboard.writeText(text)
}

function FieldHint({ children }: { children: string }) {
  return <p className="field-hint">{children}</p>
}

const waveIcons = [Store, FileText, CalendarClock, Sparkles] as const
const waveLines = {
  th: ['กำลังเตรียมข้อมูลร้าน…', 'กำลังเปิดแม่แบบเอกสาร…', 'กำลังจัดคิววันนี้…'],
  en: ['Preparing shop details…', 'Opening document templates…', 'Sorting today’s queue…'],
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
  const [docId, setDocId] = useState<(typeof documentTemplates)[number]['id']>('intake')
  const [status, setStatus] = useState('')
  const [extra, setExtra] = useState('')
  const docPreviewRef = useRef<HTMLElement>(null)
  const th = state.lang === 'th'

  useEffect(() => {
    saveToolkit(state)
  }, [state])

  useEffect(() => {
    const hash = location.hash.replace('#', '') as Section
    if (sections.includes(hash)) setPanel(hash)
    else if (location.hash) setPanel('tools')
  }, [location.hash])

  const dockItems = useMemo(
    () =>
      navItems.map((item) => {
        const icons = {
          home: Home,
          tools: LayoutGrid,
          queue: CalendarClock,
          guests: Users,
          reminders: Bell,
          reviews: Star,
          docs: FileText,
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
          <strong>{t('เครื่องมือธุรกิจฟรี', 'Free business toolkit')}</strong>
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
                      'หน้านี้เป็นสมุดงานของร้านบนเครื่องคุณ ใช้จดคิว ลูกค้าประจำ ข้อความ และเอกสาร ยังไม่ใช่ระบบจองออนไลน์ ไม่รับเงิน และไม่ส่ง SMS แทนคุณ',
                      'This page is a shop workbook on your device for queue notes, regulars, messages and templates. It is not live booking, does not take payment, and does not send SMS for you.',
                    )}
                  </p>
                  <p className="note">{toolkitDisclaimer}</p>
                  <button className="btn" type="button" onClick={() => go('settings')}>
                    {t('เริ่มใช้งานฟรี', 'Start free')} ↗
                  </button>
                </div>
                <div className="toolkit-model-grid">
                  {[
                    { id: 'queue' as Section, Icon: CalendarClock, th: 'คิววันนี้', en: "Today's queue", body: t('ดูคิววันนี้เรียงเวลา ไม่ต้องจดใส่กระดาษหรือจำเอง', 'See today in time order. No paper list to remember.') },
                    { id: 'guests' as Section, Icon: Users, th: 'ลูกค้าของฉัน', en: 'My customers', body: t('จดจำลูกค้าประจำและสิ่งที่เขาชอบ ไม่ต้องจำเอง', 'Remember regulars and what they like.') },
                    { id: 'reminders' as Section, Icon: Bell, th: 'ตัวช่วยแจ้งเตือน', en: 'Reminder helper', body: t('สร้างข้อความเตือนนัดล่วงหน้า คัดลอกไปส่งเองได้ทันที', 'Draft a reminder, then copy and send it yourself.') },
                    { id: 'reviews' as Section, Icon: Star, th: 'ดูแลรีวิว', en: 'Review care', body: t('ร่างคำตอบรีวิวมืออาชีพ และวิธีชวนลูกค้าให้รีวิว', 'Draft a professional reply and a way to ask for reviews.') },
                    { id: 'messages' as Section, Icon: MessageSquare, th: 'สร้างข้อความ', en: 'Write a message', body: t('แปลและร่างภาษาอังกฤษ แล้วคัดลอกไปส่งเอง', 'Draft English, then copy yourself.') },
                    { id: 'docs' as Section, Icon: FileText, th: 'สร้างเอกสาร', en: 'Documents', body: t('แม่แบบนโยบายร้าน ไม่ใช่คำปรึกษากฎหมาย', 'Shop templates. Not legal advice.') },
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
                    <button type="button" onClick={() => go('docs')}>
                      2 · {t('เปิดแม่แบบเอกสาร', 'Open document templates')}
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={() => go('queue')}>
                      3 · {t('จดคิววันนี้', "Add today's queue")}
                    </button>
                  </li>
                </ol>
              </section>
            </>
          ) : null}

          {panel === 'queue' || panel === 'guests' || panel === 'reminders' || panel === 'reviews' ? (
            <ToolkitDailyPanels
              panel={panel}
              state={state}
              setState={setState}
              t={t}
              setStatus={setStatus}
              copyText={copyText}
            />
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
              <p className="toolkit-explain">
                {t(
                  'กดใช้งานเพื่อเปิดแม่แบบบนเครื่องนี้ แล้วคัดลอกไปติดร้านหรือเว็บ ไม่ใช่คำปรึกษากฎหมาย และยังไม่ส่งไปให้ทนายตรวจ',
                  'Tap Use to open the template on this device, then copy it onto the shop wall or website. This is not legal advice and is not a lawyer review.',
                )}
              </p>
              <p className="note">{legalTemplateNote}</p>
              {(['often', 'legal'] as const).map((group) => (
                <div key={group} className="toolkit-doc-group">
                  <h3 className="toolkit-doc-group-title">
                    {group === 'often' ? t('ใช้บ่อยที่สุด', 'Used most often') : t('เอกสารกฎหมายพื้นฐาน', 'Basic legal documents')}
                  </h3>
                  <div className="toolkit-cards compact">
                    {documentTemplates
                      .filter((doc) => doc.group === group)
                      .map((doc) => {
                        const selected = docId === doc.id && Boolean(draft)
                        return (
                          <article key={doc.id} className={selected ? 'is-selected' : undefined}>
                            <h3>{th ? doc.th : doc.en}</h3>
                            <p>{th ? doc.whyTh : doc.whyEn}</p>
                            <button
                              className="btn small"
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                const text = generateDocument(doc.id, state.profile)
                                setDocId(doc.id)
                                setDraft(text)
                                setStatus(t('เปิดแม่แบบด้านล่างแล้ว คัดลอกหรือพิมพ์ได้', 'Template opened below. Copy or print it.'))
                                window.requestAnimationFrame(() => {
                                  docPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                })
                              }}
                            >
                              {t('ใช้งาน', 'Use')}
                            </button>
                          </article>
                        )
                      })}
                  </div>
                </div>
              ))}
              <article className="toolkit-doc-preview" ref={docPreviewRef} id="doc-preview" aria-live="polite">
                <h3>
                  {th
                    ? documentTemplates.find((d) => d.id === docId)?.th
                    : documentTemplates.find((d) => d.id === docId)?.en}
                </h3>
                <p className="note">
                  {draft
                    ? t('แก้ข้อความในช่องนี้ได้ แล้วคัดลอกหรือพิมพ์ อย่าใส่เบอร์ลูกค้าถ้าจะแปะแผ่นนี้ที่ร้าน', 'You can edit this box, then copy or print. Do not add a guest phone number if this paper stays in the shop.')
                    : t('กดใช้งานการ์ดด้านบน เพื่อเปิดแม่แบบในช่องนี้', 'Tap Use on a card above to open the template here.')}
                </p>
                <textarea
                  rows={16}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label={t('เอกสารที่สร้างแล้ว', 'Generated document')}
                  placeholder={t('แม่แบบจะโชว์ที่นี่หลังกดใช้งาน', 'The template appears here after you tap Use.')}
                />
                <pre className="toolkit-print-sheet" aria-hidden="true">
                  {draft}
                </pre>
                <FieldHint>{t('คัดลอกไปวางในร้าน หรือพิมพ์ติดเคาน์เตอร์ เครื่องมือนี้ไม่ส่งเอกสารออกไปให้ใคร', 'Copy into the shop or print for the counter. This toolkit does not send the document anywhere.')}</FieldHint>
                <div className="actions">
                  <button className="btn" type="button" onClick={() => void copyDraft()} disabled={!draft}>
                    {t('คัดลอกเอกสาร', 'Copy document')}
                  </button>
                  <button className="btn small" type="button" disabled={!draft} onClick={() => window.print()}>
                    {t('พิมพ์', 'Print')}
                  </button>
                </div>
              </article>
            </section>
          ) : null}

          {panel === 'settings' ? (
            <section>
              <h2>{t('การตั้งค่า / ข้อมูลร้าน', 'Settings / shop profile')}</h2>
              <p className="toolkit-explain">
                {t(
                  'กรอกแล้วข้อมูลอยู่บนเครื่องนี้ทันที ไม่ต้องกดส่ง ไม่ไปอีเมล ขั้นถัดไปคือเปิดแม่แบบเอกสาร หรือจดคิววันนี้',
                  'What you type stays on this device straight away. There is no send button and no email. Next, open document templates or add today’s queue.',
                )}
              </p>
              <p className="note">{t('เก็บเฉพาะข้อมูลร้านบนเครื่องนี้ ไม่เก็บเบอร์หรืออีเมลลูกค้า ชื่อเล่นในคิวอยู่บนเครื่องนี้เท่านั้น', 'Only shop details on this device. No customer phone or email. First names in the queue stay here.')}</p>
              {(
                [
                  ['name', t('ชื่อร้าน', 'Shop name'), t('ชื่อที่ลูกค้าเห็นตอนคัดลอกข้อความ', 'The name used when you copy shop messages.')],
                  ['type', t('ประเภทร้าน', 'Business type'), t('เช่น นวด สปา หรือร้านอาหาร', 'e.g. massage, spa, or restaurant.')],
                  ['phone', t('เบอร์ร้าน', 'Shop phone'), t('เบอร์ร้านสำหรับลูกค้าโทร ไม่ใช่เบอร์ลูกค้า', 'The shop number customers can call. Not a customer number.')],
                  ['address', t('ที่อยู่ร้าน', 'Shop address'), t('ที่อยู่ที่ลูกค้าจะมาตามนัด', 'The address customers use to find the shop.')],
                  ['hours', t('เวลาเปิดร้าน', 'Opening hours'), t('วันและเวลาเปิดของร้าน', 'Opening days and times for the shop.')],
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
                {t('เรื่องร้านสั้น ๆ', 'Short shop story')}
                <textarea rows={3} value={state.profile.about} onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, about: e.target.value } }))} />
                <FieldHint>{t('ข้อความต้อนรับสั้นๆ ของร้าน', 'A short welcome for the shop.')}</FieldHint>
              </label>
              <label>
                {t('โน้ตการรับชำระเงิน', 'Payment note')}
                <input value={state.profile.payNote} onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, payNote: e.target.value } }))} placeholder={t('เช่น จ่ายที่ร้าน', 'e.g. Pay in store')} />
                <FieldHint>{t('บอกลูกค้าว่าจ่ายเงินอย่างไร เช่น จ่ายที่ร้าน', 'Tell customers how to pay, e.g. pay in store.')}</FieldHint>
              </label>
              <div className="actions">
                <button className="btn" type="button" onClick={() => go('docs')}>
                  {t('ขั้นถัดไป · เปิดแม่แบบเอกสาร', 'Next · open document templates')} ↗
                </button>
                <button type="button" onClick={() => go('queue')}>
                  {t('จดคิววันนี้', "Add today's queue")}
                </button>
              </div>
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
          <article className="rail-notice">
            <p className="eyebrow">{t('ประกาศสำคัญ', 'Notice')}</p>
            <p>{surchargeNotice}</p>
          </article>
          <article className="rail-tip">
            <p className="eyebrow">{t('เคล็ดลับวันนี้', 'Today’s tip')}</p>
            <p>{th ? tipPool[0].th : tipPool[0].en}</p>
          </article>
          <article className="rail-help">
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
