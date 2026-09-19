import { useState, type FormEvent } from 'react'
import { ConversionBridge } from '../../components/toolkit/ConversionBridge'
import { copyText, Crumb, shareText, ToolkitShell } from '../../components/toolkit/ToolkitShell'
import { AI, aiGenerate } from '../../lib/toolkit/ai'
import { track } from '../../lib/toolkit/analytics'
import { guard } from '../../lib/toolkit/guards'
import { buildCustomerMessage, SCENARIOS, type MsgBiz, type MsgTone } from '../../lib/toolkit/messageBuilder'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

export function EnglishMessagePage() {
  return (
    <ToolkitShell title={{ th: 'ตัวช่วยเขียนข้อความภาษาอังกฤษ', en: 'English Message Builder' }} opened="english-message">
      <EnglishMessageInner />
    </ToolkitShell>
  )
}

function EnglishMessageInner() {
  const { t, lang } = useTranslation()
  const [what, setWhat] = useState('')
  const [biz, setBiz] = useState<MsgBiz>('massage')
  const [tone, setTone] = useState<MsgTone>('friendly')
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<ReturnType<typeof buildCustomerMessage> | null>(null)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!what.trim()) {
      setError(t({ th: 'กรุณาบอกสิ่งที่อยากสื่อ หรือกดตัวเลือกด่วนด้านล่างช่องพิมพ์', en: 'Please tell us what you want to say — or tap one of the quick options.' }))
      setResult(null)
      return
    }
    const g = guard(`${what} ${details} ${name}`)
    if (g) {
      setError(t(g.msg))
      setResult(null)
      return
    }
    setError('')
    void aiGenerate()
    const built = buildCustomerMessage({ what, details, name, biz, tone })
    setResult(built)
    track('tool_completed', { tool: 'english-message', scenario: built.scenario, tone, biz })
  }

  return (
    <>
      <Crumb />
      <h1>{t({ th: 'ตัวช่วยเขียนข้อความภาษาอังกฤษ', en: 'English Message Builder' })}</h1>
      <p className="tk-muted">
        {t({
          th: 'บอกสิ่งที่อยากสื่อ แล้วรับข้อความอังกฤษพร้อมคำอธิบายภาษาไทย — ระบบไม่ส่งข้อความให้อัตโนมัติ',
          en: 'Say what you want to tell a customer and get a ready-to-send English message with a Thai explanation. Nothing is sent automatically.',
        })}
      </p>
      <div className="tk-tool">
        <form className="tk-panel" onSubmit={onSubmit} noValidate>
          <div className="tk-warn">
            {t({
              th: 'โปรดอย่าใส่ข้อมูลส่วนตัวที่ละเอียดอ่อน เช่น ข้อมูลสุขภาพ เลขบัญชี หรือเอกสารประจำตัว',
              en: "Please don't paste sensitive personal information (health details, bank details, ID numbers).",
            })}
          </div>
          <div className="tk-field">
            <label htmlFor="msgWhat">{t({ th: 'อยากบอกอะไร?', en: 'What do you want to say?' })}</label>
            <textarea id="msgWhat" value={what} onChange={(e) => setWhat(e.target.value)} />
            <div className="tk-quick">
              {Object.values(SCENARIOS).map((s) => (
                <button key={s.chip.en} type="button" onClick={() => setWhat(lang === 'th' ? s.chip.th : s.chip.en)}>
                  {t(s.chip)}
                </button>
              ))}
            </div>
          </div>
          <div className="tk-field">
            <label htmlFor="msgBiz">{t({ th: 'ประเภทธุรกิจ', en: 'Business type' })}</label>
            <select id="msgBiz" value={biz} onChange={(e) => setBiz(e.target.value as MsgBiz)}>
              <option value="massage">Massage / Wellness</option>
              <option value="restaurant">Restaurant / Cafe</option>
              <option value="cleaning">Cleaning</option>
              <option value="beauty">Beauty & Salon</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'น้ำเสียง', en: 'Tone' })}</span>
            <div className="tk-seg" role="radiogroup">
              {(['friendly', 'professional', 'short'] as const).map((id) => (
                <label key={id}>
                  <input type="radio" name="msgTone" checked={tone === id} onChange={() => setTone(id)} />
                  <span>
                    {id === 'friendly' ? t({ th: 'เป็นกันเอง', en: 'Friendly' }) : id === 'professional' ? t({ th: 'เป็นทางการ', en: 'Professional' }) : t({ th: 'สั้น กระชับ', en: 'Short & Simple' })}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="tk-field">
            <label htmlFor="msgName">{t({ th: 'ชื่อลูกค้า', en: 'Customer name' })}</label>
            <input id="msgName" type="text" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="msgDet">{t({ th: 'รายละเอียด เช่น วัน/เวลา', en: 'Details, e.g. day / time' })}</label>
            <input id="msgDet" type="text" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Friday 3:00 pm" />
          </div>
          <button className="tk-btn tk-btn-dark" type="submit" style={{ width: '100%' }}>
            {t({ th: 'สร้างข้อความ', en: 'Create message' })} →
          </button>
        </form>
        <div className="tk-panel" aria-live="polite">
          <h3>{t({ th: 'ผลลัพธ์', en: 'Result' })}</h3>
          {error ? <div className="tk-stop" role="alert">{error}</div> : null}
          {!result && !error ? <div className="tk-empty">{t({ th: 'ข้อความจะแสดงที่นี่', en: 'Your message will appear here.' })}</div> : null}
          {result ? (
            <>
              {!AI.connected && result.note ? (
                <div className="tk-warn">
                  {t({
                    th: 'ยังไม่ได้เชื่อมต่อ AI จึงแปลข้อความอิสระไม่ได้ ลองใช้ตัวเลือกด่วน',
                    en: 'AI is not connected yet, so free-text translation is unavailable. Try a quick option.',
                  })}
                </div>
              ) : null}
              <div className="tk-out-lbl">
                <span>{t({ th: 'ข้อความภาษาอังกฤษ', en: 'English message' })}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="tk-btn tk-btn-sm" onClick={() => shareText(result.english, 'english-message')}>
                    {t({ th: 'แชร์', en: 'Share' })}
                  </button>
                  <button type="button" className="tk-btn tk-btn-dark tk-btn-sm" onClick={() => copyText(result.english, 'english-message')}>
                    {t({ th: 'คัดลอก', en: 'Copy' })}
                  </button>
                </span>
              </div>
              <div className="tk-out">{result.english}</div>
              <div className="tk-out-lbl">
                <span>{t({ th: 'คำอธิบายภาษาไทย', en: 'Thai explanation' })}</span>
                <button type="button" className="tk-btn tk-btn-dark tk-btn-sm" onClick={() => copyText(result.thai, 'english-message')}>
                  {t({ th: 'คัดลอก', en: 'Copy' })}
                </button>
              </div>
              <div className="tk-out">{result.thai}</div>
              <div className="tk-actions">
                <button
                  type="button"
                  className="tk-btn tk-btn-sm"
                  onClick={() => {
                    setWhat(''); setName(''); setDetails(''); setResult(null); setError('')
                  }}
                >
                  {t({ th: 'เริ่มใหม่', en: 'Start Again' })}
                </button>
              </div>
              <ConversionBridge tool="english-message" />
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
