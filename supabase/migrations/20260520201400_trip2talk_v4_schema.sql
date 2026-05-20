-- ============================================
-- Trip2Talk V4 — Supabase SQL Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: staff_profiles
-- ============================================
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nickname TEXT,
  pin_hash TEXT NOT NULL, -- bcrypt hashed PIN
  role TEXT NOT NULL DEFAULT 'staff'
    CHECK (role IN ('staff','cashier','owner')),
  commission_rate_per_pax NUMERIC(6,2) NOT NULL DEFAULT 50.00,
  commission_bonus_threshold INTEGER DEFAULT 10, -- pax count for bonus
  commission_bonus_amount NUMERIC(6,2) DEFAULT 50.00,
  bank_bsb TEXT,
  bank_account TEXT,
  tfn_provided BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: tours
-- ============================================
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_code TEXT NOT NULL UNIQUE, -- e.g. "T2T-2025-001"
  destination TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ NOT NULL,
  max_pax INTEGER NOT NULL DEFAULT 15,
  current_pax INTEGER NOT NULL DEFAULT 0,
  base_price_aud NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','open','confirmed','departed','completed','cancelled')),
  lead_staff_id UUID REFERENCES staff_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: staff_commission_ledger
-- ============================================
CREATE TABLE staff_commission_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_profiles(id),
  tour_id UUID REFERENCES tours(id),
  pax_count INTEGER NOT NULL,
  base_commission NUMERIC(10,2) NOT NULL,
  bonus_commission NUMERIC(10,2) DEFAULT 0,
  total_commission NUMERIC(10,2) GENERATED ALWAYS AS (base_commission + bonus_commission) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','paid')),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: crm_clients
-- ============================================
CREATE TABLE crm_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  preferred_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  passport_number TEXT, -- stored encrypted
  nationality TEXT,
  date_of_birth DATE,
  -- OSHC
  oshc_provider TEXT,
  oshc_policy_number TEXT,
  oshc_expiry DATE,
  oshc_card_url TEXT, -- Supabase Storage path
  -- Medical & Safety (encrypted)
  medical_notes_encrypted TEXT, -- pgp encrypted
  dietary_requirements TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  -- Waiver
  waiver_signed_at TIMESTAMPTZ,
  waiver_ip_address TEXT,
  waiver_version TEXT DEFAULT 'v1.0',
  waiver_language TEXT DEFAULT 'bilingual',
  -- Visa
  visa_status TEXT DEFAULT 'unknown'
    CHECK (visa_status IN ('unknown','applied','approved','expired','not_required')),
  visa_expiry DATE,
  visa_type TEXT,
  -- Meta
  client_tier TEXT DEFAULT 'standard'
    CHECK (client_tier IN ('standard','vip','platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: tour_bookings (junction)
-- ============================================
CREATE TABLE tour_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id),
  client_id UUID REFERENCES crm_clients(id),
  staff_id UUID REFERENCES staff_profiles(id), -- assigned staff
  booking_status TEXT DEFAULT 'pending'
    CHECK (booking_status IN ('pending','confirmed','waitlist','cancelled')),
  amount_paid_aud NUMERIC(10,2) DEFAULT 0,
  payment_method TEXT,
  payment_reference TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: expenses (ATO-structured)
-- ============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id),
  staff_id UUID REFERENCES staff_profiles(id), -- who submitted
  -- ATO Metadata
  ato_category TEXT NOT NULL
    CHECK (ato_category IN (
      'accommodation','transport','meals_entertainment',
      'guide_fees','marketing','office','equipment',
      'insurance','visa_fees','other'
    )),
  ato_deductible BOOLEAN DEFAULT TRUE,
  gst_claimable BOOLEAN DEFAULT FALSE,
  gst_amount NUMERIC(10,2) DEFAULT 0,
  -- Receipt
  amount_aud NUMERIC(10,2) NOT NULL,
  vendor_name TEXT,
  receipt_filename TEXT, -- [TRIP-ID]_[DATE]_[AMOUNT]_Receipt.jpg
  receipt_storage_url TEXT,
  receipt_uploaded_at TIMESTAMPTZ,
  -- Meta
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  sync_status TEXT DEFAULT 'local'
    CHECK (sync_status IN ('local','synced','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_commission_ledger ENABLE ROW LEVEL SECURITY;

-- Staff can read tours
CREATE POLICY "staff_read_tours" ON tours
  FOR SELECT USING (auth.role() = 'authenticated');

-- Owner full access
CREATE POLICY "owner_all_expenses" ON expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Staff read own commission
CREATE POLICY "staff_read_own_commission" ON staff_commission_ledger
  FOR SELECT USING (
    staff_id = (
      SELECT id FROM staff_profiles WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_tours_departure ON tours(departure_date);
CREATE INDEX idx_bookings_tour ON tour_bookings(tour_id);
CREATE INDEX idx_bookings_client ON tour_bookings(client_id);
CREATE INDEX idx_expenses_tour ON expenses(tour_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_commission_staff ON staff_commission_ledger(staff_id);

-- ============================================
-- Updated_at trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at BEFORE UPDATE ON tours
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER clients_updated_at BEFORE UPDATE ON crm_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
