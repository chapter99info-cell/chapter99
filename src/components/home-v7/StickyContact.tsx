import { useEffect, useState } from 'react'
import { v7Copy } from '../../content/v7'

type Props = { heroSelector?: string }

export function StickyContact({ heroSelector = '.home-v7 .hero' }: Props) {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hero = document.querySelector(heroSelector)
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const show = !entry.isIntersecting
        setVisible(show)
        if (!show) setOpen(false)
      },
      { threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [heroSelector])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <div className="mbar" hidden={!visible}>
        <a className="btn btn--gold" href={v7Copy.contact.sms}>
          {v7Copy.th.ctaSms}
        </a>
        <a className="btn btn--line" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
          {v7Copy.th.ctaFacebook}
        </a>
      </div>
      <button
        type="button"
        className={`fab${visible ? ' show' : ''}`}
        aria-expanded={open}
        aria-controls="cpanel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fab__open">ทักแชท Facebook</span>
        <span className="fab__x">✕</span>
      </button>
      {open && visible ? (
        <div className="cpanel" id="cpanel" role="dialog" aria-label="ติดต่อเรา">
          <h4>ติดต่อเรา</h4>
          <a href={v7Copy.contact.phoneHref}>
            <i>📞</i>
            <span>
              <b>โทรหาเรา</b>
              {v7Copy.contact.phoneDisplay}
            </span>
            ›
          </a>
          <a href={v7Copy.contact.sms}>
            <i>💬</i>
            <span>
              <b>{v7Copy.th.ctaSms}</b>
              0452 044 382
            </span>
            ›
          </a>
          <a href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
            <i>✉️</i>
            <span>
              <b>ทักแชท Facebook</b>
              Chapter99
            </span>
            ›
          </a>
          <a href={`mailto:${v7Copy.contact.email}`}>
            <i>📧</i>
            <span>
              <b>อีเมล</b>
              {v7Copy.contact.email}
            </span>
            ›
          </a>
        </div>
      ) : null}
    </>
  )
}
