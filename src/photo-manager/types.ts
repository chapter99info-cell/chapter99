export type JobType = 'wedding' | 'engagement' | 'portrait' | 'family'
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
  }
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

export type Expense = {
  id: string
  dateISO: string
  category: string
  description: string
  amount: number
  linkedClientId: string | null
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
}
