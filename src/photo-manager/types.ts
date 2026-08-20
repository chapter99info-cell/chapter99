export type JobType =
  | 'wedding'
  | 'engagement'
  | 'studio'
  | 'event'
  | 'portrait'
  | 'family'
  | 'massage-spa'
  | 'food'
  | 'hair-beauty'
  | 'other'
  | 'photographer'
  | 'tutoring'
  | 'fitness'
export type JobStatus = 'draft' | 'pending' | 'confirmed' | 'paid'
export type Role = 'owner' | 'staff'
export type PaymentMethod = 'bank' | 'card' | 'afterpay'
export type IncomeReceipt = 'full' | 'deposit_only' | 'none'

export type Checklist = {
  preshoot: boolean
  balance: boolean
  gallery: boolean
  review: boolean
}

export type PackageKind = 'wedding' | 'engagement'

export type CatalogPackage = {
  id: string
  kind: PackageKind
  name: string
  price: number
  hours: number
  blurb: string[]
}

export type Addon = {
  id: string
  name: string
  price: number
  suggestsExpense?: { category: string; description: string; typicalAmount: number }
}

export type Client = {
  id: string
  name: string
  type: JobType
  typeLabel: string
  packageId: string | null
  fixedPrice: number | null
  customPrice: number | null
  date: string
  dateISO: string
  ceremonyTime: string
  location: string
  deposit: number
  status: JobStatus
  statusLabel: string
  phone: string
  email: string
  addonIds: string[]
  /** Per-client add-on prices (AUD inc GST). Missing key = catalog price. */
  addonPrices: Record<string, number>
  checklist: Checklist
  briefConfirmed: boolean
  contractConfirmed: boolean
  confirmToken: string | null
  gallery: {
    pictime: string
    drive: string
    password: string
  }
  payment: {
    method: PaymentMethod
    reference: string
    paidAt: string | null
  }
  quote: {
    expiryISO: string
    issued: boolean
    calculator?: QuoteCalcDraft
  }
  /** Empty = use default tips for this job type. */
  prepTips: string
  /** Empty = auto-generate a short day plan from the crew timeline. */
  daySummary: string
}

export type Vendor = {
  role: string
  name: string
  phone: string
  email: string
}

export type VendorSheet = {
  clientId: string
  vendors: Vendor[]
}

export type ExpenseFrequency = 'once' | 'monthly' | 'yearly'

export type Expense = {
  id: string
  dateISO: string
  category: string
  description: string
  amount: number
  linkedClientId: string | null
  frequency: ExpenseFrequency
  /** Inclusive last day this recurring item still applies. Null = ongoing. */
  endedISO: string | null
}

export type Profile = {
  id: string
  email: string
  name: string
  role: Role
  passwordHash: string
}

export type Session = {
  profileId: string
  role: Role
  email: string
  name: string
  pinSet: boolean
}

export type InvoiceTotals = {
  base: number
  standardBase: number
  discountDelta: number
  addons: { id: string; name: string; price: number }[]
  addonsTotal: number
  gstInclusive: number
  subtotal: number
  gst: number
  surchargeRate: number
  surcharge: number
  totalToPay: number
}

export type QuoteProjectKind = 'photography' | 'website' | 'combined'

export type QuoteProfession =
  | 'wedding'
  | 'engagement'
  | 'studio'
  | 'event'
  | 'portrait'
  | 'massage-spa'
  | 'food'
  | 'hair-beauty'
  | 'photographer'
  | 'tutoring'
  | 'fitness'
  | 'other'

export type QuoteCalcScope = {
  projectKind?: QuoteProjectKind
  profession: QuoteProfession
  professionOther: string
  photoHours: number
  photoCount: number
  webPages: number
  webBooking: boolean
  webGallery: boolean
  webBilingual: boolean
  modules: string[]
}

/** Frozen snapshot stored on client.quote so later rate edits do not rewrite issued quotes. */
export type QuoteCalcDraft = QuoteCalcScope & {
  ratesSnapshot: Record<string, number>
  setupFull: number
  setupIntro: number
  monthlyFull: number
  monthlyIntro: number
  savedAt: string
}

export type QuoteRate = {
  id: string
  amount: number
  label: string
}

export type BrandLogo = {
  type: string
  logo_url: string
}

export type DbSnapshot = {
  clients: Client[]
  expenses: Expense[]
  vendorSheets: VendorSheet[]
  packages: CatalogPackage[]
  addons: Addon[]
  profiles: Profile[]
  brandLogos: BrandLogo[]
  quoteRates: QuoteRate[]
}
