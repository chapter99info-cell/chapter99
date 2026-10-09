import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { pricing } from '../../content/pricing'
import { v7Copy } from '../../content/v7'
import { PricingPage } from './PricingPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <PricingPage />
    </MemoryRouter>,
  )
}

describe('/pricing V7', () => {
  afterEach(() => cleanup())

  it('renders prices from pricing.ts', () => {
    renderPage()
    expect(screen.getAllByText(pricing.starter.setup).length).toBeGreaterThan(0)
    expect(screen.getByText(pricing.professional.setup)).toBeInTheDocument()
    expect(screen.getAllByText(pricing.addons.photography.price).length).toBeGreaterThan(0)
    expect(screen.getAllByText(pricing.addons.reels.price).length).toBeGreaterThan(0)
    expect(screen.getAllByText(pricing.addons.square.price).length).toBeGreaterThan(0)
  })

  it('has no Product Catalog, WhatsApp, or Photography tab', () => {
    renderPage()
    expect(document.body.textContent).not.toMatch(/Product Catalog/i)
    expect(document.body.textContent).not.toMatch(/WhatsApp/i)
    expect(document.body.innerHTML).not.toMatch(/wa\.me/i)
    expect(screen.queryByRole('tab', { name: /photography|ถ่ายภาพ|ช่างภาพ/i })).toBeNull()
  })

  it('toggles wording between massage and restaurant', () => {
    renderPage()
    expect(screen.getByText('ระบบจองคิว')).toBeInTheDocument()
    expect(document.querySelector('a[href="/mockup/v7/demo-booking.html"]')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: 'ร้านอาหาร' }))
    expect(screen.getByText('ระบบสั่งอาหาร')).toBeInTheDocument()
    expect(document.querySelector('a[href="/mockup/v7/demo-order.html"]')).toBeTruthy()
    expect(screen.queryByText('ระบบจองคิว')).toBeNull()
  })

  it('uses Facebook inbox CTAs and V7 footer ABN', () => {
    renderPage()
    expect(document.querySelectorAll(`a[href="${v7Copy.contact.facebookInbox}"]`).length).toBeGreaterThan(1)
    expect(document.querySelector(`a[href="${v7Copy.contact.sms}"]`)).toBeTruthy()
    expect(screen.getByText(/ABN 81 951 461 769/)).toBeInTheDocument()
  })
})
