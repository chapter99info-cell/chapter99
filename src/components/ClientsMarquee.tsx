const clientItems = [
  {
    label: 'Mira Thai Massage',
    style: { fontFamily: '"Times New Roman", serif', fontWeight: 400, letterSpacing: '0.02em', fontSize: '14px' },
  },
  {
    label: 'Thai Garlic Restaurant',
    style: {
      fontFamily: '"Arial Black", sans-serif',
      fontWeight: 900,
      letterSpacing: '0.06em',
      fontSize: '15px',
    },
  },
  {
    label: 'Jasmine Massage & Spa',
    style: { fontFamily: 'Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '16px' },
  },
  {
    label: 'Koala Wellness',
    style: { fontFamily: 'Helvetica, sans-serif', fontWeight: 700, letterSpacing: '-0.01em', fontSize: '15px' },
  },
  {
    label: 'Princess Thai Massage',
    style: {
      fontFamily: '"Courier New", monospace',
      fontWeight: 700,
      letterSpacing: '0.14em',
      fontSize: '13px',
      textTransform: 'uppercase' as const,
    },
  },
  {
    label: 'Sydney Thai Business',
    style: {
      fontFamily: 'Verdana, sans-serif',
      fontWeight: 700,
      letterSpacing: '0.06em',
      fontSize: '13px',
      textTransform: 'uppercase' as const,
    },
  },
  {
    label: 'Chapter99 Clients',
    style: { fontFamily: 'Palatino, serif', fontWeight: 500, letterSpacing: '0.03em', fontSize: '15px' },
  },
]

export default function ClientsMarquee() {
  const items = [...clientItems, ...clientItems]

  return (
    <section id="portfolio" className="bg-[#F5F5F5] px-6 py-16">
      <div className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-8 md:grid-cols-4">
        <p className="text-base leading-relaxed text-black/60">
          ธุรกิจไทยในออสเตรเลียที่ไว้วางใจเรา
        </p>

        <div className="overflow-hidden md:col-span-3">
          <div className="clients-track">
            {items.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="mx-10 shrink-0 whitespace-nowrap text-black/40"
                style={item.style}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
