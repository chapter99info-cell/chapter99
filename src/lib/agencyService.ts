import { mapPrompt, mapTask, promptToRow, taskToRow } from './agencyMappers'
import { isValidAssigneeForDepartment, type DepartmentId } from './departmentConfig'
import { supabase } from './supabase'
import { formatSupabaseError } from './supabaseErrors'
import type { Prompt, PromptAgent, Task, TaskStatus } from '../types/agency'

function throwIfError(error: unknown): void {
  if (error) throw new Error(formatSupabaseError(error))
}

export async function fetchTasks(projectId?: string): Promise<Task[]> {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
  if (projectId) query = query.eq('project_id', projectId)
  const { data, error } = await query
  throwIfError(error)
  return (data ?? []).map(mapTask)
}

export async function createTask(
  input: Omit<Task, 'id'> & { departmentId: DepartmentId }
): Promise<Task> {
  if (!isValidAssigneeForDepartment(input.departmentId, input.assignee)) {
    throw new Error(`Assignee ${input.assignee} is not valid for department ${input.departmentId}`)
  }
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskToRow(input))
    .select()
    .single()
  if (error) throwIfError(error)
  return mapTask(data)
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throwIfError(error)
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  const row: Record<string, unknown> = {}
  if (patch.title !== undefined) row.title = patch.title
  if (patch.status !== undefined) row.status = patch.status
  if (patch.assignee !== undefined) row.assignee = patch.assignee
  if (patch.promptOrSpec !== undefined) row.prompt_or_spec = patch.promptOrSpec
  if (patch.notes !== undefined) row.notes = patch.notes
  if (patch.departmentId !== undefined) row.department_id = patch.departmentId
  const { error } = await supabase.from('tasks').update(row).eq('id', id)
  if (error) throwIfError(error)
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throwIfError(error)
}

export async function fetchPrompts(agent?: PromptAgent): Promise<Prompt[]> {
  let query = supabase.from('prompts').select('*').order('department')
  if (agent) query = query.eq('agent', agent)
  const { data, error } = await query
  if (error) throwIfError(error)
  return (data ?? []).map(mapPrompt)
}

export async function savePrompt(prompt: Omit<Prompt, 'id'> & { id?: string }): Promise<Prompt> {
  if (prompt.id) {
    const { data, error } = await supabase
      .from('prompts')
      .update(promptToRow(prompt))
      .eq('id', prompt.id)
      .select()
      .single()
    if (error) throwIfError(error)
    return mapPrompt(data)
  }
  const { data, error } = await supabase
    .from('prompts')
    .insert(promptToRow(prompt))
    .select()
    .single()
  if (error) throwIfError(error)
  return mapPrompt(data)
}

export async function deletePrompt(id: string): Promise<void> {
  const { error } = await supabase.from('prompts').delete().eq('id', id)
  if (error) throwIfError(error)
}

export async function ensureDefaultProject(): Promise<string> {
  const { data: existing, error: existingErr } = await supabase.from('projects').select('id').limit(1)
  if (existingErr) throwIfError(existingErr)
  if (existing?.[0]?.id) return String(existing[0].id)

  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .insert({
      business_name: 'Internal',
      contact_name: 'Phee Saen',
      email: 'admin@chapter99info.com',
      phone: '',
    })
    .select()
    .single()
  if (clientErr) throwIfError(clientErr)

  const { data: project, error: projErr } = await supabase
    .from('projects')
    .insert({
      client_id: client.id,
      project_type: 'FULL_SERVICE',
      status: 'IN_PROGRESS',
      drive_folder_url: '',
      contract_url: '',
    })
    .select()
    .single()
  if (projErr) throwIfError(projErr)
  return String(project.id)
}
