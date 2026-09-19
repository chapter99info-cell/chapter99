import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Crumb, ToolkitShell, trackContact } from '../../components/toolkit/ToolkitShell'
import { track } from '../../lib/toolkit/analytics'
import { bandColor, CHECK_QUESTIONS, scoreBusinessCheck } from '../../lib/toolkit/businessCheck'
import { formatAud, publicPackages } from '../../../config/pricing'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

function Ring({ pct, size, stroke, label }: { pct: number; size: number; stroke: number; label: string }) {
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  return (
    <div className="rg-wrap" style={{ width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct / 100)}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>{label}</div>
    </div>
  )
}

export function BusinessCheckPage() {
  return (
    <ToolkitShell title={{ th: 'ตรวจความพร้อมทางดิจิทัลของธุรกิจ', en: 'Business Digital Check' }} opened="business-check">
      <BusinessCheckInner />
    </ToolkitShell>
  )
}

function BusinessCheckInner() {
  const { t } = useTranslation()
  const [answers, setAnswers] = useState<(number | null)[]>(Array(8).fill(null))
  const [error, setError] = useState('')
  const [result, setResult] = useState<ReturnType<typeof scoreBusinessCheck> | null>(null)
  const starter = publicPackages.find((p) => p.id === 'starter')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (answers.some((n) => n == null)) {
      setError(t({ th: 'กรุณาตอบให้ครบ 8 ข้อ', en: 'Please answer all 8 questions.' }))
      setResult(null)
      return
    }
    setError('')
    const scored = scoreBusinessCheck(answers as number[])
    setResult(scored)
    track('business_check_completed', { result: scored.cat, score: scored.score })
  }

  const catCopy =
    result?.cat === 's'
      ? { en: 'Strong foundation', th: 'พื้นฐานแข็งแรง', body: { en: 'Your basics look solid. A few small touches can keep customers moving smoothly from finding you to choosing you.', th: 'พื้นฐานของคุณดีอยู่แล้ว การปรับเล็กน้อยช่วยให้ลูกค้าจากการค้นเจอไปสู่การเลือกคุณได้ลื่นขึ้น' } }
      : result?.cat === 'o'
        ? { en: 'Some opportunities', th: 'มีโอกาสปรับปรุง', body: { en: 'You have a good start, with a few gaps that could make it easier for customers to choose you.', th: 'คุณเริ่มต้นได้ดี และยังมีช่องว่างบางจุดที่ช่วยให้ลูกค้าเลือกคุณได้ง่ายขึ้น' } }
        : { en: 'Needs attention', th: 'ควรให้ความสำคัญ', body: { en: 'Several basics are missing right now. The steps below are a practical place to start.', th: 'ตอนนี้ยังขาดพื้นฐานหลายอย่าง ขั้นตอนด้านล่างคือจุดเริ่มต้นที่ทำได้จริง' } }

  return (
    <>
      <Crumb />
      <h1>{t({ th: 'ตรวจความพร้อมทางดิจิทัลของธุรกิจ', en: 'Business Digital Check' })}</h1>
      <p className="tk-muted">
        {t({
          th: 'ตอบ 8 ข้อสั้น ๆ เพื่อดูว่าลูกค้าค้นเจอและติดต่อธุรกิจคุณได้ง่ายแค่ไหน — ไม่ใช่การตรวจด้านกฎหมายหรือกฎระเบียบ และไม่มีการเก็บคำตอบของคุณ',
          en: 'Answer 8 quick questions to see how easy it is for customers to find and act on your business. This is not a legal or compliance audit, and your answers are not stored.',
        })}
      </p>
      <div className="tk-tool">
        <form className="tk-panel" onSubmit={onSubmit} noValidate>
          {CHECK_QUESTIONS.map((q, i) => (
            <fieldset className="tk-q" key={q.k}>
              <legend style={{ fontWeight: 600 }}>{t(q.q)}</legend>
              <div className="tk-muted" style={{ fontSize: 13, marginBottom: 10 }}>{t(q.h)}</div>
              <div className="tk-seg">
                {([
                  [2, { th: 'ใช่', en: 'Yes' }],
                  [1, { th: 'บางส่วน', en: 'Partly' }],
                  [0, { th: 'ยังไม่มี', en: 'Not yet' }],
                ] as const).map(([v, label]) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={answers[i] === v}
                      onChange={() => setAnswers((cur) => cur.map((n, idx) => (idx === i ? v : n)))}
                    />
                    <span>{t(label)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <button className="tk-btn tk-btn-dark" type="submit" style={{ width: '100%' }}>
            {t({ th: 'ดูผลลัพธ์', en: 'See my result' })} →
          </button>
        </form>
        <div className="tk-panel" aria-live="polite">
          <h3>{t({ th: 'ผลลัพธ์', en: 'Your result' })}</h3>
          {error ? <div className="tk-stop" role="alert">{error}</div> : null}
          {!result && !error ? <div className="tk-empty">{t({ th: 'ตอบคำถามแล้วกด “ดูผลลัพธ์”', en: 'Answer the questions, then press “See my result”.' })}</div> : null}
          {result ? (
            <>
              <div className={`tk-score ${result.cat}`} role="group" aria-label="Score">
                <Ring pct={result.pct} size={150} stroke={13} label={`${result.score} / 16`} />
                <div>
                  <h3>{t({ th: catCopy.th, en: catCopy.en })}</h3>
                  <p>{t(catCopy.body)}</p>
                </div>
              </div>
              <div className="tk-lbl">{t({ th: 'เส้นทางของลูกค้า', en: 'Your customer journey' })}</div>
              <div className="tk-minis">
                {result.groups.map((g) => (
                  <div className="tk-mini" key={g.id}>
                    <strong>{g.pct}%</strong>
                    <span className="t" style={{ display: 'block', fontSize: 12.5, fontWeight: 600 }}>{t({ th: g.th, en: g.en })}</span>
                  </div>
                ))}
              </div>
              <div className="tk-lbl">{t({ th: 'คะแนนแต่ละด้าน', en: 'Score by area' })}</div>
              {CHECK_QUESTIONS.map((q, i) => {
                const v = result.answers[i] * 50
                return (
                  <div className="tk-bar" key={q.k}>
                    <span>{t(q.q)}</span>
                    <div className="tk-tr">
                      <div className={`tk-fl ${bandColor(v || 10)}`} style={{ width: `${Math.max(v, 6)}%` }} />
                    </div>
                    <em>{result.answers[i] === 2 ? t({ th: 'แข็งแรง', en: 'Strong' }) : result.answers[i] === 1 ? t({ th: 'บางส่วน', en: 'Partly' }) : t({ th: 'ยังไม่มี', en: 'Missing' })}</em>
                  </div>
                )
              })}
              <div className="tk-lbl" style={{ marginTop: 20 }}>{t({ th: '3 ขั้นตอนถัดไปที่ทำได้จริง', en: 'Top 3 practical next steps' })}</div>
              {result.topSteps.map((s, i) => (
                <div className="tk-step" key={s.en}>
                  <div className="tk-no">{i + 1}</div>
                  <span>{t(s)}</span>
                </div>
              ))}
              <div className="tk-upsell">
                {result.gaps.length ? (
                  <>
                    <h3>{t({ th: 'ให้ Chapter99 จัดการแทนคุณ', en: 'Want Chapter99 to set this up for you?' })}</h3>
                    <p>
                      {t({
                        th: `คุณมี ${result.gaps.length} ด้านที่ปรับปรุงได้ เราช่วยตั้งค่าและเชื่อมให้`,
                        en: `You have ${result.gaps.length} area${result.gaps.length > 1 ? 's' : ''} that can be improved. We can help set them up.`,
                      })}
                    </p>
                    <ul>
                      {result.gaps.slice(0, 4).map((g) => (
                        <li key={g.k}>{t(g.q)}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <h3>{t({ th: 'รักษาความแข็งแรงไว้', en: 'Keep your foundation strong' })}</h3>
                    <p>{t({ th: 'ธุรกิจของคุณดูดีอยู่แล้ว หากอยากให้เราช่วยดูแลต่อเนื่อง คุยกับเราได้', en: 'Your basics look good. If you’d like help keeping things running smoothly, talk to us.' })}</p>
                  </>
                )}
                <Link className="tk-btn tk-btn-sm" style={{ background: '#fff', color: '#123b2f' }} to="/contact" onClick={() => trackContact('business-check')}>
                  {t({ th: 'คุยกับ Chapter99', en: 'Talk to Chapter99' })}
                </Link>
                <Link className="tk-btn tk-btn-sm" style={{ borderColor: '#fff', color: '#fff', marginLeft: 8 }} to="/pricing" onClick={() => track('tool_to_packages_clicked', { tool: 'business-check', destination: '/pricing' })}>
                  {t({ th: 'ดูแพ็กเกจ', en: 'See packages' })}
                </Link>
                {starter?.setupAud != null && starter.monthlyAud != null ? (
                  <span className="tk-muted" style={{ display: 'block', marginTop: 12, color: '#a9c3b5' }}>
                    {t({
                      th: `แพ็กเกจเริ่มต้น ${formatAud(starter.setupAud)} ค่าติดตั้ง + ${formatAud(starter.monthlyAud)} ต่อเดือน`,
                      en: `Packages start from ${formatAud(starter.setupAud)} setup + ${formatAud(starter.monthlyAud)} / month.`,
                    })}
                  </span>
                ) : null}
              </div>
              <div className="tk-info">
                {t({
                  th: 'ผลนี้มาจากคำตอบของคุณเท่านั้น ไม่ใช่การวัดผลจริงของธุรกิจ และไม่ใช่การตรวจด้านกฎหมายหรือกฎระเบียบ',
                  en: 'This result is based only on your answers. It isn’t a measurement of real business performance, or a legal/compliance audit.',
                })}
              </div>
              <div className="tk-actions">
                <button type="button" className="tk-btn tk-btn-sm" onClick={() => { setAnswers(Array(8).fill(null)); setResult(null); setError('') }}>
                  {t({ th: 'ทำใหม่', en: 'Start again' })}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}
