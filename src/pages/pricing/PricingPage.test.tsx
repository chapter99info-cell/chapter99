import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { money, plansFor, pricing } from '../../content/pricing'
import { PricingPage } from './PricingPage'

function renderPricing(path = '/pricing') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <PricingPage />
    </MemoryRouter>,
  )
}

afterEach(() => cleanup())

describe('/pricing segments', () => {
  it('renders three massage cards with prices from pricing.ts', () => {
    renderPricing()
    const plans = plansFor('massage')
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Starter' })).toBeInTheDocument()
    expect(screen.getAllByText(money(plans[0].setup)).length).toBeGreaterThan(0)
    expect(screen.getByText(`+ ${money(pricing.massage.professional.monthly)} / เดือน`)).toBeInTheDocument()
    expect(screen.getByText(`เริ่มต้น ${money(pricing.massage.business.setup)}`)).toBeInTheDocument()
    expect(screen.getByText('แก้ข้อมูล 2 รอบ/เดือน')).toBeInTheDocument()
    expect(screen.getByText(/ราคารวม GST แล้ว/)).toBeInTheDocument()
    expect(screen.queryByText('เริ่มต้น A$199')).toBeNull()
    expect(document.body.textContent).not.toMatch(/ไม่จำกัด|Loyalty|WhatsApp|ป้ายจอ|signage|สั่งออนไลน์ผ่าน Square|Square online ordering/)
    expect(screen.getByText('รายงานยอดขาย ส่งออก CSV')).toBeInTheDocument()
  })

  it('switches to three restaurant cards', () => {
    renderPricing()
    fireEvent.click(screen.getByRole('tab', { name: 'ร้านอาหาร' }))
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Order' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Launch' })).toBeInTheDocument()
    expect(screen.getAllByText(money(pricing.restaurant.menu.setup)).length).toBeGreaterThan(0)
    expect(screen.getByText(`เริ่มต้น ${money(pricing.restaurant.launch.setup)}`)).toBeInTheDocument()
    expect(screen.queryByText('เริ่มต้น A$349')).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Starter' })).toBeNull()
    expect(document.body.textContent).not.toMatch(/ป้ายจอ|signage|สั่งออนไลน์ผ่าน Square|Square online ordering/)
    expect(screen.getByText('ระบบสั่งอาหารออนไลน์ (รับที่ร้าน)')).toBeInTheDocument()
  })

  it('renders three photography cards from pricing.ts with no monthly fee', () => {
    renderPricing()
    fireEvent.click(screen.getByRole('tab', { name: 'ถ่ายภาพ' }))
    expect(screen.getByRole('heading', { name: 'Essential' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Half Day' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Full Day' })).toBeInTheDocument()
    expect(screen.getByText(`${money(pricing.photography.essential.setup)} / ครั้ง`)).toBeInTheDocument()
    expect(screen.getByText(`${money(pricing.photography.halfDay.setup)} / ครั้ง`)).toBeInTheDocument()
    expect(screen.getByText(`${money(pricing.photography.fullDay.setup)} / ครั้ง`)).toBeInTheDocument()
    expect(screen.getByText('ถ่าย 1 ชม.')).toBeInTheDocument()
    expect(screen.getByText('ถ่าย 4 ชม.')).toBeInTheDocument()
    expect(screen.getByText('ถ่าย 8 ชม.')).toBeInTheDocument()
    expect(screen.getByText(/เหมาะกับ ภาพร้าน ทีมงาน/)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/\+ A\$\d+ \/ เดือน/)
    expect(document.body.textContent).not.toMatch(/ไม่จำกัดจำนวนภาพ|photo count/i)
    expect(screen.getByText(/รวม: คุยบรีฟ/)).toBeInTheDocument()
  })

  it('opens photography via ?tab=photography', () => {
    renderPricing('/pricing?tab=photography')
    expect(screen.getByRole('tab', { name: 'ถ่ายภาพ' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: 'Essential' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Starter' })).toBeNull()
  })

  it('has three shop-type tabs', () => {
    renderPricing()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })
})
