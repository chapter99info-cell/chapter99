import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { pricing } from '../content/pricing'
import { v7Copy } from '../content/v7'
import HomeV7 from './HomeV7'

describe('/v7 homepage', () => {
  it('renders hero, SOP prices, and WhatsApp', () => {
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
    const wa = document.querySelector(`a[href^="${v7Copy.contact.whatsapp}"]`)
    expect(wa).toBeTruthy()
  })
})
