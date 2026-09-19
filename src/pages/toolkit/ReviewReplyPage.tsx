import { useState, type FormEvent } from 'react'
import { ConversionBridge } from '../../components/toolkit/ConversionBridge'
import { copyText, Crumb, shareText, ToolkitShell } from '../../components/toolkit/ToolkitShell'
import { track } from '../../lib/toolkit/analytics'
import { guard } from '../../lib/toolkit/guards'
import { draftReviewReply, type RvLang, type RvTone } from '../../lib/toolkit/reviewReply'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

export function ReviewReplyPage() {
  return (
    <ToolkitShell title={{ th: 'ตัวช่วยตอบรีวิว Google', en: 'Google Review Reply Helper' }} opened="review-reply">
      <ReviewReplyInner />
    </ToolkitShell>
  )
}

function ReviewReplyInner() {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [rate, setRate] = useState(5)
  const [tone, setTone] = useState<RvTone>('friendly')
  const [lang, setLang] = useState<RvLang>('en')
  const [biz, setBiz] = useState('')
  const [variant, setVariant] = useState(0)
  const [shorter, setShorter] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  function run(reset: boolean) {
    if (reset) {
      setVariant(0)
      setShorter(false)
    }
    if (!text.trim()) {
      setError(t({ th: 'กรุณาวางรีวิวของลูกค้าก่อน', en: 'Please paste the customer review first.' }))
      setDone(false)
      return
    }
    const g = guard(text, { review: true })
    if (g) {
      setError(t(g.msg))
      setDone(false)
      return
    }
    setError('')
    setDone(true)
    track('tool_completed', { tool: 'review-reply', rating: rate, tone, lang })
  }

  const draft = done ? draftReviewReply({ rate, tone, lang, biz, variant, shorter }) : null

  return (
    <>
      <Crumb />
      <h1>{t({ th: 'ตัวช่วยตอบรีวิว Google', en: 'Google Review Reply Helper' })}</h1>
      <p className="tk-muted">
        {t({
          th: 'วางรีวิวของลูกค้า แล้วรับร่างคำตอบ — ระบบไม่โพสต์ไปที่ Google ให้ คุณตรวจและโพสต์เอง',
          en: 'Paste a customer review and get a draft reply. Nothing is published to Google — you review and post it yourself.',
        })}
      </p>
      <div className="tk-tool">
        <form
          className="tk-panel"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            run(true)
          }}
          noValidate
        >
          <div className="tk-warn">
            {t({
              th: 'โปรดอย่าวางข้อมูลส่วนตัวที่ละเอียดอ่อนของลูกค้า (เช่น ข้อมูลสุขภาพ) และอย่าเปิดเผยรายละเอียดลูกค้าในคำตอบสาธารณะ',
              en: "Don't paste sensitive customer information (e.g. health details), and never share customer details in a public reply.",
            })}
          </div>
          <div className="tk-field">
            <label htmlFor="rvText">{t({ th: 'รีวิวของลูกค้า', en: 'Customer review' })}</label>
            <textarea id="rvText" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'คะแนน', en: 'Rating' })}</span>
            <div className="tk-seg">
              {[5, 4, 3, 2, 1].map((n) => (
                <label key={n}>
                  <input type="radio" name="rvRate" checked={rate === n} onChange={() => setRate(n)} />
                  <span>{n} ★</span>
                </label>
              ))}
            </div>
          </div>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'น้ำเสียง', en: 'Tone' })}</span>
            <div className="tk-seg">
              {(['friendly', 'professional', 'warm'] as const).map((id) => (
                <label key={id}>
                  <input type="radio" name="rvTone" checked={tone === id} onChange={() => setTone(id)} />
                  <span>{id === 'friendly' ? t({ th: 'เป็นกันเอง', en: 'Friendly' }) : id === 'professional' ? t({ th: 'เป็นทางการ', en: 'Professional' }) : t({ th: 'อบอุ่น', en: 'Warm' })}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'ภาษา', en: 'Language' })}</span>
            <div className="tk-seg">
              {(['en', 'th', 'both'] as const).map((id) => (
                <label key={id}>
                  <input type="radio" name="rvLang" checked={lang === id} onChange={() => setLang(id)} />
                  <span>{id === 'en' ? 'English' : id === 'th' ? 'ไทย' : t({ th: 'ทั้งสอง', en: 'Both' })}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="tk-field">
            <label htmlFor="rvBiz">{t({ th: 'ชื่อธุรกิจ (ใช้ลงท้าย)', en: 'Business name (for sign-off)' })}</label>
            <input id="rvBiz" type="text" autoComplete="off" value={biz} onChange={(e) => setBiz(e.target.value)} />
          </div>
          <button className="tk-btn tk-btn-dark" type="submit" style={{ width: '100%' }}>
            {t({ th: 'สร้างคำตอบ', en: 'Create reply' })} →
          </button>
        </form>
        <div className="tk-panel" aria-live="polite">
          <h3>{t({ th: 'ร่างคำตอบ', en: 'Suggested reply' })}</h3>
          {error ? <div className="tk-stop" role="alert">{error}</div> : null}
          {!done && !error ? <div className="tk-empty">{t({ th: 'ร่างคำตอบจะแสดงที่นี่', en: 'Your draft reply will appear here.' })}</div> : null}
          {draft ? (
            <>
              <div className="tk-info">
                {t({
                  th: 'ร่างจากเทมเพลต (ยังไม่เชื่อมต่อ AI) โปรดแก้ไขก่อนโพสต์ — ไม่มีการเผยแพร่อัตโนมัติ',
                  en: 'Template draft (AI not connected). Edit before posting — this is not published anywhere.',
                })}
              </div>
              {draft.english ? (
                <>
                  <div className="tk-out-lbl">
                    <span>{t({ th: 'คำตอบภาษาอังกฤษ', en: 'English reply' })}</span>
                    <span style={{ display: 'flex', gap: 8 }}>
                      <button type="button" className="tk-btn tk-btn-sm" onClick={() => shareText(draft.english, 'review-reply')}>{t({ th: 'แชร์', en: 'Share' })}</button>
                      <button type="button" className="tk-btn tk-btn-dark tk-btn-sm" onClick={() => copyText(draft.english, 'review-reply')}>{t({ th: 'คัดลอก', en: 'Copy' })}</button>
                    </span>
                  </div>
                  <div className="tk-out">{draft.english}</div>
                </>
              ) : null}
              {draft.thai ? (
                <>
                  <div className="tk-out-lbl">
                    <span>{t({ th: 'คำตอบภาษาไทย', en: 'Thai reply' })}</span>
                    <button type="button" className="tk-btn tk-btn-dark tk-btn-sm" onClick={() => copyText(draft.thai, 'review-reply')}>{t({ th: 'คัดลอก', en: 'Copy' })}</button>
                  </div>
                  <div className="tk-out">{draft.thai}</div>
                </>
              ) : null}
              <div className="tk-actions">
                <button type="button" className="tk-btn tk-btn-sm" onClick={() => { setVariant((v) => v + 1); setShorter(false) }}>{t({ th: 'สร้างใหม่', en: 'Regenerate' })}</button>
                <button type="button" className="tk-btn tk-btn-sm" onClick={() => setShorter(true)}>{t({ th: 'ให้สั้นลง', en: 'Shorter' })}</button>
              </div>
              {draft.bucket === 'neg' ? (
                <div className="tk-info">{t({ th: 'เคล็ดลับ: อย่าเปิดเผยรายละเอียดของลูกค้าในคำตอบสาธารณะ', en: 'Tip: don’t share customer details in a public reply — move the conversation to a private channel.' })}</div>
              ) : null}
              <ConversionBridge tool="review-reply" />
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
