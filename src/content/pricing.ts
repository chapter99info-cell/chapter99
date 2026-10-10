export const pricing = {
  starter: {
    name: 'Starter',
    setup: 'A$199',
    monthly: 'A$19',
    setupAud: 199,
    monthlyAud: 19,
  },
  professional: {
    name: 'Professional',
    setup: 'A$499',
    monthly: 'A$49',
    setupAud: 499,
    monthlyAud: 49,
  },
  addons: {
    photography: { name: 'Photography', price: 'A$349', amountAud: 349 },
    reels: { name: 'Reels', price: 'A$349', amountAud: 349 },
    square: { name: 'Square Setup', price: 'A$199', amountAud: 199 },
  },
} as const
