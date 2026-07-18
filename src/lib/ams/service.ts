import { supabase } from '../supabase'
import { amsDb } from './db'
import type {
  AmsClient,
  AmsLead,
  AmsProject,
  AmsRole,
  Deliverable,
  LeadStatus,
  Payment,
  PaymentStatus,
  ProjectAdminOverview,
  StaffProfile,
} from '../../types/ams'

export async function fetchMyStaffProfile(): Promise<StaffProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await amsDb(supabase)
    .from('staff_profiles')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return data as StaffProfile
}

export async function requireAmsRole(
  allowed: AmsRole[]
): Promise<{ profile: StaffProfile; role: AmsRole } | { error: string }> {
  const profile = await fetchMyStaffProfile()
  if (!profile) {
    return {
      error:
        'No AMS staff profile for this account. Sign in with email/password and ensure ams.staff_profiles has your user as admin or staff.',
    }
  }
  if (!allowed.includes(profile.role)) {
    return { error: `This page requires role: ${allowed.join(' or ')}` }
  }
  return { profile, role: profile.role }
}

export async function listAdminOverview(): Promise<ProjectAdminOverview[]> {
  const { data, error } = await amsDb(supabase)
    .from('projects_admin_overview')
    .select('*')
    .order('deadline', { ascending: true, nullsFirst: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as ProjectAdminOverview[]
}

export async function getAdminProject(id: string): Promise<ProjectAdminOverview | null> {
  const { data, error } = await amsDb(supabase)
    .from('projects_admin_overview')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data as ProjectAdminOverview | null
}

export async function listClients(): Promise<AmsClient[]> {
  const { data, error } = await amsDb(supabase)
    .from('clients')
    .select('*')
    .order('contact_name')

  if (error) throw new Error(error.message)
  return (data ?? []) as AmsClient[]
}

export async function listStaff(): Promise<StaffProfile[]> {
  const { data, error } = await amsDb(supabase)
    .from('staff_profiles')
    .select('*')
    .eq('is_active', true)
    .order('full_name')

  if (error) throw new Error(error.message)
  return (data ?? []) as StaffProfile[]
}

export async function createClient(input: {
  contact_name: string
  email?: string | null
  phone?: string | null
  client_type?: string
  business_name?: string | null
}): Promise<AmsClient> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await amsDb(supabase)
    .from('clients')
    .insert({
      contact_name: input.contact_name.trim(),
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      client_type: input.client_type || 'individual',
      business_name: input.business_name?.trim() || null,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as AmsClient
}

export async function createProject(input: {
  title: string
  client_id: string
  staff_id?: string | null
  service_type?: string
  deadline?: string | null
  brief?: string | null
  deliver_on_deposit?: boolean
  deposit_amount_cents?: number
  total_amount_cents?: number | null
}): Promise<AmsProject> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await amsDb(supabase)
    .from('projects')
    .insert({
      title: input.title.trim(),
      client_id: input.client_id,
      staff_id: input.staff_id || null,
      service_type: input.service_type || 'photography',
      deadline: input.deadline || null,
      brief: input.brief?.trim() || null,
      deliver_on_deposit: Boolean(input.deliver_on_deposit),
      deposit_amount_cents: input.deposit_amount_cents ?? 0,
      total_amount_cents: input.total_amount_cents ?? null,
      status: 'capturing',
      payment_status: 'unpaid',
      created_by: user?.id ?? null,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as AmsProject
}

export async function listProjectDeliverables(projectId: string): Promise<Deliverable[]> {
  const { data, error } = await amsDb(supabase)
    .from('deliverables')
    .select('*')
    .eq('project_id', projectId)
    .order('version', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Deliverable[]
}

export async function listProjectPayments(projectId: string): Promise<Payment[]> {
  const { data, error } = await amsDb(supabase)
    .from('payments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Payment[]
}

export async function recordPayment(input: {
  project_id: string
  amount_cents: number
  status: PaymentStatus
  method?: string | null
  reference?: string | null
  notes?: string | null
}): Promise<Payment> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await amsDb(supabase)
    .from('payments')
    .insert({
      project_id: input.project_id,
      amount_cents: input.amount_cents,
      status: input.status,
      method: input.method || null,
      reference: input.reference || null,
      notes: input.notes || null,
      recorded_by: user?.id ?? null,
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as Payment
}

export async function markProjectCompleted(projectId: string): Promise<void> {
  const { error } = await amsDb(supabase)
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)

  if (error) throw new Error(error.message)
}

export async function assignProjectStaff(
  projectId: string,
  staffId: string | null
): Promise<void> {
  const { error } = await amsDb(supabase)
    .from('projects')
    .update({ staff_id: staffId })
    .eq('id', projectId)

  if (error) throw new Error(error.message)
}

export async function listLeads(): Promise<AmsLead[]> {
  const { data, error } = await amsDb(supabase)
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as AmsLead[]
}

export async function createLead(input: {
  name: string
  source?: string
  fb_profile_url?: string | null
  contact_note?: string | null
}): Promise<AmsLead> {
  const { data, error } = await amsDb(supabase)
    .from('leads')
    .insert({
      name: input.name.trim(),
      source: input.source || 'facebook',
      fb_profile_url: input.fb_profile_url?.trim() || null,
      contact_note: input.contact_note?.trim() || null,
      status: 'new',
    })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as AmsLead
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await amsDb(supabase).from('leads').update({ status }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function listStaffAssignments(): Promise<
  Pick<AmsProject, 'id' | 'title' | 'status' | 'deadline' | 'service_type'>[]
> {
  const profile = await fetchMyStaffProfile()
  if (!profile) throw new Error('Not an AMS staff member')

  let query = amsDb(supabase)
    .from('projects')
    .select('id, title, status, deadline, service_type')
    .not('status', 'in', '(completed,cancelled)')
    .order('deadline', { ascending: true, nullsFirst: false })

  if (profile.role === 'staff') {
    query = query.eq('staff_id', profile.id)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Pick<AmsProject, 'id' | 'title' | 'status' | 'deadline' | 'service_type'>[]
}

export async function updateStaffProjectStatus(
  projectId: string,
  status: 'capturing' | 'editing' | 'ready_for_review'
): Promise<void> {
  const { error } = await amsDb(supabase)
    .from('projects')
    .update({ status })
    .eq('id', projectId)

  if (error) throw new Error(error.message)
}

export async function submitDeliverable(input: {
  project_id: string
  link: string
  notes?: string | null
  mark_ready?: boolean
}): Promise<string> {
  const { data, error } = await amsDb(supabase).rpc('submit_deliverable', {
    p_project_id: input.project_id,
    p_link: input.link.trim(),
    p_notes: input.notes?.trim() || null,
    p_mark_ready: Boolean(input.mark_ready),
  })

  if (error) throw new Error(error.message)
  return data as string
}
