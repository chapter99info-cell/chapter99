import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { fromPrices, money } from '../content/pricing'
import { v7Copy } from '../content/v7'
import App from '../App'
import HomeV7 from './HomeV7'

const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u

function renderHome() {
  return render(
    <MemoryRouter>
      <HomeV7 />
    </MemoryRouter>,
  )
}

describe('/v7 homepage', () => {
  afterEach(() => cleanup())

  it('renders hero, SOP prices, SMS and Facebook inbox', () => {
    renderHome()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('WE BUILD')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('THAT SELL.')
    expect(screen.getByText(v7Copy.th.heroSub)).toBeInTheDocument()
    expect(screen.getByText(`ดูแพ็กเกจ · เริ่มต้น ${money(fromPrices.massage)} →`)).toBeInTheDocument()
    expect(screen.getByText('THAI GARLIC')).toBeInTheDocument()
    expect(screen.getByText('Princess Thai Massage')).toBeInTheDocument()
    expect(v7Copy.stats.enabled).toBe(true)
    expect(screen.getByText('1995')).toBeInTheDocument()
    expect(screen.getByText('ตั้งแต่ 1995 · ใช้ชีวิตในซิดนีย์')).toBeInTheDocument()
    expect(screen.getByText('เกือบ 10 ปี')).toBeInTheDocument()
    expect(screen.getByText('ช่วยธุรกิจไทยในซิดนีย์')).toBeInTheDocument()
    expect(screen.getByText('10 ปี')).toBeInTheDocument()
    expect(screen.getByText('ประสบการณ์ช่างภาพ')).toBeInTheDocument()
    expect(screen.getByText('บริการครบในที่เดียว')).toBeInTheDocument()
    expect(screen.getByText('เว็บ · จองคิว/สั่งอาหาร · ถ่ายภาพ · Reels · Square')).toBeInTheDocument()
    expect(document.querySelectorAll('.stat').length).toBe(4)
    expect(document.body.textContent).not.toMatch(/Business Audit/i)
    expect(
      screen.getByText(`ร้านนวด เริ่ม ${money(fromPrices.massage)} · ร้านอาหาร เริ่ม ${money(fromPrices.restaurant)}`),
    ).toBeInTheDocument()
    expect(screen.getByText(`ถ่ายภาพอย่างเดียว เริ่ม ${money(fromPrices.photography)}`)).toBeInTheDocument()
    expect(document.querySelector('a[href="/pricing?tab=photography"]')).toBeTruthy()
    expect(document.querySelector('a[href="/pricing"]')).toBeTruthy()
    expect(document.querySelector(`a[href="${v7Copy.contact.sms}"]`)).toBeTruthy()
    expect(document.querySelector(`a[href="${v7Copy.contact.facebookInbox}"]`)).toBeTruthy()
    expect(screen.getByText(/ABN 81 951 461 769/)).toBeInTheDocument()
    expect(document.body.innerHTML).not.toMatch(/wa\.me/i)
    expect(document.body.textContent).not.toMatch(/WhatsApp/i)
    expect(document.body.textContent).not.toMatch(/ป้ายจอ|signage|สั่งออนไลน์ผ่าน Square|Square online ordering/)
  })

  it('has no horizontal overflow lock and one mobile sticky contact without emoji', () => {
    renderHome()
    const root = document.querySelector('.home-v7') as HTMLElement
    expect(root.className).toContain('home-v7')
    expect(document.querySelector('.home-v7')?.ownerDocument.defaultView).toBeTruthy()
    expect(document.querySelectorAll('.mbar').length).toBe(1)
    expect(document.querySelector('.fab')).toBeNull()
    expect(document.querySelector('.cpanel')).toBeNull()
    const contact = document.querySelectorAll('footer, .mbar, .cpanel, .fcontact')
    contact.forEach((node) => {
      expect(node.textContent || '').not.toMatch(emoji)
      expect(node.innerHTML).not.toMatch(emoji)
    })
  })

  it('serves V7 on / with 200-route, not a mockup redirect', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('WE BUILD')
    expect(document.documentElement.lang).toBe('th')
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://www.chapter99info.com/',
    )
    expect(document.body.innerHTML).not.toMatch(/destination": "\/mockup\//)
  })

  it('redirects /v7 to /', async () => {
    render(
      <MemoryRouter initialEntries={['/v7']}>
        <App />
      </MemoryRouter>,
    )
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('WE BUILD')
  })

  it('uses Kanit headings and Sarabun body, not Taviraj or Anuphan', () => {
    const css = readFileSync(resolve(__dirname, '../styles/home-v7.css'), 'utf8')
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')
    expect(css).toMatch(/--f-th:\s*"Kanit"/)
    expect(css).toMatch(/--f-body:\s*"Sarabun"/)
    expect(css).not.toMatch(/Taviraj/)
    expect(css).not.toMatch(/Noto Sans Thai Looped/)
    expect(css).not.toMatch(/Anuphan/)
    expect(css).not.toMatch(/IBM Plex Sans Thai/)
    expect(html).toMatch(/family=Kanit/)
    expect(html).toMatch(/family=Sarabun/)
    expect(html).not.toMatch(/Taviraj/)
    expect(html).not.toMatch(/Noto\+Sans\+Thai\+Looped/)
    expect(html).not.toMatch(/Anuphan/)
    expect(html).not.toMatch(/IBM\+Plex\+Sans\+Thai/)
  })

  it('opens the mobile menu from the burger', () => {
    renderHome()
    fireEvent.click(screen.getAllByRole('button', { name: 'เปิดเมนู' })[0])
    expect(screen.getByRole('dialog', { name: 'เมนู' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ปิดเมนู' })).toHaveAttribute('aria-expanded', 'true')
  })
})
