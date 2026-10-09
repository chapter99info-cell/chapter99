import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { pricing } from '../content/pricing'
import { v7Copy } from '../content/v7'
import HomeV7 from './HomeV7'

describe('/v7 homepage', () => {
  it('renders hero, SOP prices, SMS and Facebook inbox', () => {
    render(
      <MemoryRouter>
        <HomeV7 />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(v7Copy.th.heroHeadline)
    expect(screen.getAllByText(pricing.starter.setup).length).toBeGreaterThan(0)
    expect(screen.getByText(`+ ${pricing.starter.monthly} / เดือน`)).toBeInTheDocument()
    expect(screen.getByText(pricing.professional.setup)).toBeInTheDocument()
    expect(screen.getByText(`+ ${pricing.professional.monthly} / เดือน`)).toBeInTheDocument()
    expect(document.querySelector(`a[href="${v7Copy.contact.sms}"]`)).toBeTruthy()
    expect(document.querySelector(`a[href="${v7Copy.contact.facebookInbox}"]`)).toBeTruthy()
    expect(screen.getByText(/ABN 81 951 461 769/)).toBeInTheDocument()
    expect(document.body.innerHTML).not.toMatch(/wa\.me/i)
    expect(document.body.textContent).not.toMatch(/WhatsApp/i)
  })
})
