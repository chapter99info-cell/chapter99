import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { ConversionBridge } from '../../components/toolkit/ConversionBridge'
import { Crumb, ToolkitShell } from '../../components/toolkit/ToolkitShell'
import { track } from '../../lib/toolkit/analytics'
import { incentiveHit } from '../../lib/toolkit/guards'
import { useTranslation } from '../../cinematic/i18n/LanguageContext'

function validUrl(u: string) {
  try {
    const x = new URL(u)
    return x.protocol === 'https:' || x.protocol === 'http:'
  } catch {
    return false
  }
}

export function PosterStudioPage() {
  return (
    <ToolkitShell title={{ th: 'ตัวช่วยทำการ์ดจอง & โปสเตอร์ QR รีวิว', en: 'Poster Studio' }} opened="poster-studio">
      <PosterStudioInner />
    </ToolkitShell>
  )
}

function PosterStudioInner() {
  const { t } = useTranslation()
  const [type, setType] = useState<'card' | 'review'>('card')
  const [theme, setTheme] = useState<'th-forest' | 'th-navy' | 'th-gold'>('th-forest')
  const [biz, setBiz] = useState('')
  const [url, setUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [addr, setAddr] = useState('')
  const [web, setWeb] = useState('')
  const [msg, setMsg] = useState('')
  const [gift, setGift] = useState(false)
  const [hicaps, setHicaps] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [qr, setQr] = useState('')
  const [err, setErr] = useState('')
  const [bridge, setBridge] = useState(false)

  useEffect(() => {
    let cancelled = false
    setErr('')
    if (msg && type === 'review') {
      const hit = incentiveHit(msg)
      if (hit) {
        setErr(t(hit.msg))
        setQr('')
        return
      }
    }
    if (!url) {
      setQr('')
      return
    }
    if (!validUrl(url)) {
      setErr(t({ th: 'กรุณาใส่ลิงก์เต็มที่ขึ้นต้นด้วย https://', en: 'Please enter a full link starting with https://' }))
      setQr('')
      return
    }
    QRCode.toDataURL(url, { margin: 1, width: 220, errorCorrectionLevel: 'M' }).then((data) => {
      if (!cancelled) setQr(data)
    })
    return () => {
      cancelled = true
    }
  }, [url, msg, type, t])

  function ready() {
    if (!url || !validUrl(url) || err) {
      return false
    }
    return true
  }

  async function posterBlob() {
    if (!ready()) return null
    const canvas = document.createElement('canvas')
    const qrCanvas = document.createElement('canvas')
    await QRCode.toCanvas(qrCanvas, url, { margin: 1, width: 480, errorCorrectionLevel: 'M' })
    const X = canvas.getContext('2d')
    if (!X) return null
    if (type === 'card') {
      canvas.width = 1620
      canvas.height = 1000
      X.fillStyle = theme === 'th-navy' ? '#f4f1e8' : theme === 'th-gold' ? '#fbf3dc' : '#f6efdc'
      X.fillRect(0, 0, 1620, 1000)
      X.fillStyle = theme === 'th-navy' ? '#12326b' : theme === 'th-gold' ? '#5a4413' : '#123b2f'
      X.font = '400 72px Georgia'
      X.fillText(biz || 'Your Business Name', 80, 220)
      X.font = '400 28px Inter, sans-serif'
      X.fillText(phone ? `☎ ${phone}` : '', 80, 300)
      X.fillText(addr, 80, 340)
      X.fillText(web, 80, 380)
      X.font = '700 32px Inter, sans-serif'
      X.fillText(headline, 80, 480)
      if (gift) X.fillText('Gift vouchers', 80, 540)
      if (hicaps) X.fillText('HICAPS', 80, 590)
      if (photo) {
        const img = new Image()
        img.src = photo
        await new Promise((ok) => { img.onload = () => ok(null); img.onerror = () => ok(null) })
        if (img.naturalWidth) X.drawImage(img, 980, 80, 520, 420)
      }
      X.drawImage(qrCanvas, 1180, 620, 280, 280)
    } else {
      canvas.width = 1240
      canvas.height = 1754
      X.fillStyle = '#f6efdc'
      X.fillRect(0, 0, 1240, 1754)
      X.fillStyle = '#123b2f'
      X.font = '400 80px Georgia'
      X.textAlign = 'center'
      X.fillText(t({ th: 'รีวิวเรา', en: 'Review us' }), 620, 240)
      X.font = '400 36px Georgia'
      X.fillText(biz, 620, 310)
      X.font = '500 28px Inter, sans-serif'
      X.fillText(headline, 620, 1280)
      X.drawImage(qrCanvas, 370, 620, 500, 500)
    }
    return new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'))
  }

  async function downloadPng() {
    const b = await posterBlob()
    if (!b) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(b)
    a.download = `${(biz || 'poster').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${type}.png`
    a.click()
    track('tool_completed', { tool: 'poster-studio', action: 'image_download' })
    setBridge(true)
  }

  async function sharePng() {
    const b = await posterBlob()
    if (!b) return
    const f = new File([b], `poster-${type}.png`, { type: 'image/png' })
    track('tool_result_shared', { tool: 'poster-studio' })
    if (navigator.canShare?.({ files: [f] })) {
      try {
        await navigator.share({ files: [f], title: biz || 'Poster' })
      } catch {
        /* cancelled */
      }
    } else {
      await downloadPng()
    }
    setBridge(true)
  }

  async function qrOnly() {
    if (!ready()) return
    const data = await QRCode.toDataURL(url, { margin: 1, width: 1024 })
    const a = document.createElement('a')
    a.href = data
    a.download = 'qr-code.png'
    a.click()
    track('tool_completed', { tool: 'poster-studio', action: 'qr_png' })
    setBridge(true)
  }

  const headline = msg || (type === 'card' ? 'PLEASE BOOK ONLINE' : t({ th: 'ความคิดเห็นของคุณช่วยให้เราพัฒนาและบริการคุณได้ดีขึ้น', en: 'Your feedback helps us grow and serve you better!' }))

  return (
    <>
      <Crumb />
      <h1>{t({ th: 'ตัวช่วยทำการ์ดจอง & โปสเตอร์ QR รีวิว', en: 'Poster Studio' })}</h1>
      <p className="tk-muted">
        {t({
          th: 'ใส่ข้อมูลร้านของคุณ แล้วได้การ์ดจองออนไลน์หรือโปสเตอร์ QR รีวิว Google พร้อมพิมพ์ — ข้อมูลและรูปอยู่ในเครื่องคุณเท่านั้น',
          en: 'Add your shop details and get a print-ready “Book online” card or Google review QR poster. Your details and photos stay on your device.',
        })}
      </p>
      <div className="tk-tool">
        <form className="tk-panel" onSubmit={(e) => e.preventDefault()}>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'แบบที่ต้องการ', en: 'What do you want to make?' })}</span>
            <div className="tk-seg">
              <label>
                <input type="radio" checked={type === 'card'} onChange={() => setType('card')} />
                <span>{t({ th: 'การ์ดจองออนไลน์', en: 'Book-online card' })}</span>
              </label>
              <label>
                <input type="radio" checked={type === 'review'} onChange={() => setType('review')} />
                <span>{t({ th: 'โปสเตอร์ QR รีวิว Google', en: 'Google review poster' })}</span>
              </label>
            </div>
          </div>
          <div className="tk-field">
            <label htmlFor="psBiz">{t({ th: 'ชื่อร้าน', en: 'Business name' })}</label>
            <input id="psBiz" type="text" autoComplete="off" value={biz} onChange={(e) => setBiz(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="psUrl">{type === 'review' ? t({ th: 'ลิงก์รีวิว Google ของคุณ', en: 'Your Google review link' }) : t({ th: 'ลิงก์จองออนไลน์ของคุณ', en: 'Your booking link' })}</label>
            <input id="psUrl" type="url" inputMode="url" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
            <div style={{ fontSize: 13, marginTop: 6 }}>
              <a href="/pricing" style={{ color: '#2f6b4f', fontWeight: 600 }} onClick={() => track('tool_to_packages_clicked', { tool: 'poster-studio', destination: '/pricing' })}>
                {t({ th: 'ยังไม่มีลิงก์จอง? ดูว่า Chapter99 ตั้งให้ได้อย่างไร', en: 'No booking link yet? See how Chapter99 can set it up' })}
              </a>
            </div>
          </div>
          <div className="tk-field">
            <label htmlFor="psPhone">{t({ th: 'เบอร์โทร', en: 'Phone' })}</label>
            <input id="psPhone" type="text" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="psAddr">{t({ th: 'ที่อยู่', en: 'Address' })}</label>
            <input id="psAddr" type="text" value={addr} onChange={(e) => setAddr(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="psWeb">{t({ th: 'เว็บไซต์', en: 'Website' })}</label>
            <input id="psWeb" type="text" value={web} onChange={(e) => setWeb(e.target.value)} />
          </div>
          <div className="tk-field">
            <label htmlFor="psMsg">{t({ th: 'ข้อความหลัก', en: 'Headline message' })}</label>
            <input id="psMsg" type="text" value={msg} onChange={(e) => setMsg(e.target.value)} />
          </div>
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'สีธีม', en: 'Colour theme' })}</span>
            <div className="tk-seg">
              {(['th-forest', 'th-navy', 'th-gold'] as const).map((id) => (
                <label key={id}>
                  <input type="radio" checked={theme === id} onChange={() => setTheme(id)} />
                  <span>{id === 'th-forest' ? t({ th: 'เขียวป่า', en: 'Forest' }) : id === 'th-navy' ? t({ th: 'น้ำเงิน', en: 'Navy' }) : t({ th: 'ทอง', en: 'Gold' })}</span>
                </label>
              ))}
            </div>
          </div>
          {type === 'card' ? (
            <div className="tk-field">
              <span className="tk-lbl">{t({ th: 'ป้ายเสริม (ติ๊กเฉพาะที่เป็นจริง)', en: 'Extra badges (tick only what is true for your shop)' })}</span>
              <div className="tk-seg">
                <label>
                  <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} />
                  <span>{t({ th: 'มีบัตรของขวัญ', en: 'Gift vouchers available' })}</span>
                </label>
                <label>
                  <input type="checkbox" checked={hicaps} onChange={(e) => setHicaps(e.target.checked)} />
                  <span>HICAPS</span>
                </label>
              </div>
            </div>
          ) : null}
          <div className="tk-field">
            <span className="tk-lbl">{t({ th: 'โลโก้ / รูปจริงของร้าน (ไม่บังคับ)', en: 'Your logo / real photo (optional)' })}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const r = new FileReader()
                r.onload = () => setPhoto(String(r.result))
                r.readAsDataURL(f)
              }}
            />
            <button type="button" className="tk-btn tk-btn-sm" onClick={() => setPhoto(null)}>{t({ th: 'ลบรูป', en: 'Remove' })}</button>
            <div className="tk-info">{t({ th: 'ใช้ภาพถ่ายจริงของร้านคุณ รูปไม่ถูกอัปโหลดไปที่ไหน', en: 'Use real photos of your own shop. Photos are not uploaded anywhere.' })}</div>
          </div>
          {err ? <div className="tk-stop" role="alert">{err}</div> : null}
        </form>
        <div className="tk-panel">
          <h3>{t({ th: 'ตัวอย่าง', en: 'Preview' })}</h3>
          <div className="tk-poster-stage">
            <div id="posterPrint" className={`tk-poster ${type} ${theme}`}>
              {type === 'card' ? (
                <div className="p-card">
                  <div className="l">
                    <div className="biz">{biz || 'Your Business Name'}</div>
                    <div className="tk-muted" style={{ fontFamily: 'var(--sans)' }}>
                      {phone ? `☎ ${phone}` : ''}
                      {addr ? <><br />⌖ {addr}</> : null}
                      {web ? <><br />◎ {web}</> : null}
                    </div>
                  </div>
                  <div className="r">
                    <div className="photo" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>{photo ? '' : 'Your real photo here'}</div>
                    <span className="pill">{headline}</span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--sans)' }}>
                      {gift ? <span className="pill">{t({ th: 'บัตรของขวัญ', en: 'Gift vouchers' })}</span> : null}
                      {hicaps ? <span className="pill">HICAPS</span> : null}
                    </div>
                    <div className="qrbox" style={{ width: '34%', minWidth: 70 }}>{qr ? <img alt="" src={qr} /> : t({ th: 'QR จะแสดงตรงนี้', en: 'QR appears here' })}</div>
                  </div>
                  <div className="foot band">
                    <span>✓ {t({ th: 'จองง่าย', en: 'Easy booking' })}</span>
                    <span>▦ {t({ th: 'ดูเวลาว่าง', en: 'See availability' })}</span>
                    <span>◷ {t({ th: 'ประหยัดเวลา', en: 'Save time' })}</span>
                  </div>
                </div>
              ) : (
                <div className="p-rev">
                  <div className="top">
                    <h4>
                      <em>{t({ th: 'รีวิวเรา', en: 'Review us' })}</em>
                      <br />
                      {t({ th: 'บน Google', en: 'on Google' })}
                    </h4>
                    <div className="biz">{biz}</div>
                  </div>
                  <div className="mid">
                    <div className="qrbox">{qr ? <img alt="" src={qr} /> : t({ th: 'QR จะแสดงตรงนี้', en: 'QR appears here' })}</div>
                  </div>
                  <div className="msg">{headline}</div>
                  <div className="foot band">
                    {addr}
                    {phone ? ` · ${phone}` : ''} {web}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="tk-actions">
            <button type="button" className="tk-btn tk-btn-dark tk-btn-sm" onClick={sharePng}>{t({ th: 'ส่งรูป (Messenger / LINE / อีเมล)', en: 'Send image (Messenger / LINE / email)' })}</button>
            <button type="button" className="tk-btn tk-btn-sm" onClick={downloadPng}>{t({ th: 'ดาวน์โหลดรูป (PNG)', en: 'Download image (PNG)' })}</button>
            <button type="button" className="tk-btn tk-btn-sm" onClick={() => { if (!ready()) return; track('tool_completed', { tool: 'poster-studio', action: 'print' }); setBridge(true); window.print() }}>{t({ th: 'พิมพ์ / บันทึกเป็น PDF', en: 'Print / Save as PDF' })}</button>
            <button type="button" className="tk-btn tk-btn-sm" onClick={qrOnly}>{t({ th: 'ดาวน์โหลด QR อย่างเดียว', en: 'QR only (PNG)' })}</button>
          </div>
          {bridge ? <ConversionBridge tool="poster-studio" /> : null}
        </div>
      </div>
    </>
  )
}
