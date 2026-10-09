import { useEffect, useState } from 'react'
import { WA } from './Hero'

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
        <a className="btn btn--gold" href={WA}>
          คุยภาษาไทย (WhatsApp)
        </a>
      </div>
      <button
        type="button"
        className={`fab${visible ? ' show' : ''}`}
        aria-expanded={open}
        aria-controls="cpanel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fab__open">💬 คุยภาษาไทย</span>
        <span className="fab__x">✕</span>
      </button>
      {open && visible ? (
        <div className="cpanel" id="cpanel" role="dialog" aria-label="ติดต่อเรา">
          <h4>ติดต่อเรา</h4>
          <a href="tel:+61452044382">
            <i>📞</i>
            <span>
              <b>โทรหาเรา</b>0452 044 382
            </span>
            ›
          </a>
          <a href={WA} className="wa">
            <i>💬</i>
            <span>
              <b>WhatsApp</b>ทักภาษาไทยได้เลย
            </span>
            ›
          </a>
          <a href="https://m.me/61586534972406" target="_blank" rel="noopener noreferrer">
            <i>✉️</i>
            <span>
              <b>Inbox Facebook</b>Chapter99
            </span>
            ›
          </a>
          <a href="mailto:chapter99solutions@gmail.com">
            <i>📧</i>
            <span>
              <b>อีเมล</b>chapter99solutions@gmail.com
            </span>
            ›
          </a>
        </div>
      ) : null}
    </>
  )
}
