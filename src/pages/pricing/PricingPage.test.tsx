import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { money, plansFor, pricing } from '../../content/pricing'
import { PricingPage } from './PricingPage'

function renderPricing() {
  return render(
    <MemoryRouter>
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
    expect(screen.getByText(`+ ${money(plans[1].monthly)} / เดือน`)).toBeInTheDocument()
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
})
