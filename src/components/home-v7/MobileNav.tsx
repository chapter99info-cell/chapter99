import { useEffect } from 'react'
import { v7Copy } from '../../content/v7'

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="mnav" id="v7-mnav" role="dialog" aria-label="เมนู" onClick={onClose}>
      <nav className="mnav__list" onClick={(e) => e.stopPropagation()}>
        <a href="#massage" onClick={onClose}>
          ตัวอย่างร้าน
        </a>
        <a href="#how" onClick={onClose}>
          วิธีทำงาน
        </a>
        <a href="#packages" onClick={onClose}>
          ราคา
        </a>
        <a href="#faq" onClick={onClose}>
          คำถาม
        </a>
        <a className="btn btn--gold" href={v7Copy.contact.sms}>
          {v7Copy.th.ctaSms}
        </a>
        <a className="btn btn--line" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
          {v7Copy.th.ctaFacebook}
        </a>
      </nav>
    </div>
  )
}
