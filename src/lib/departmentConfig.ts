import type { TaskAssignee } from '../types/agency'

export const DEPARTMENTS = [
  { id: 1 as const, name: 'Account & Strategy', defaultAssignee: 'CLAUDE' as TaskAssignee },
  { id: 2 as const, name: 'Creative & Design', defaultAssignee: 'GEMINI' as TaskAssignee },
  { id: 3 as const, name: 'Content & Copywriting', defaultAssignee: 'GEMINI' as TaskAssignee },
  { id: 4 as const, name: 'Engineering & Development', defaultAssignee: 'CURSOR' as TaskAssignee },
  { id: 5 as const, name: 'QA & Delivery', defaultAssignee: 'PHEE_SAEN' as TaskAssignee },
  { id: 6 as const, name: 'Admin & Operations', defaultAssignee: 'PHEE_SAEN' as TaskAssignee },
  { id: 7 as const, name: 'Marketing & Growth', defaultAssignee: 'GEMINI' as TaskAssignee },
  { id: 8 as const, name: 'Data & Analytics', defaultAssignee: 'CLAUDE' as TaskAssignee },
  { id: 9 as const, name: 'Client Support', defaultAssignee: 'PHEE_SAEN' as TaskAssignee },
] as const

export type DepartmentId = (typeof DEPARTMENTS)[number]['id']

/** Allowed assignees per department (agency workflow v1.5) */
const DEPARTMENT_ASSIGNEES: Record<DepartmentId, TaskAssignee[]> = {
  1: ['CLAUDE', 'PHEE_SAEN'],
  2: ['GEMINI', 'PHEE_SAEN'],
  3: ['GEMINI', 'PHEE_SAEN'],
  4: ['CURSOR', 'PHEE_SAEN'],
  5: ['PHEE_SAEN', 'CLAUDE'],
  6: ['PHEE_SAEN'],
  7: ['GEMINI', 'PHEE_SAEN'],
  8: ['CLAUDE', 'PHEE_SAEN'],
  9: ['PHEE_SAEN'],
}

export function getDepartmentName(id: number): string {
  return DEPARTMENTS.find((d) => d.id === id)?.name ?? `Department ${id}`
}

export function getDefaultAssignee(departmentId: DepartmentId): TaskAssignee {
  return DEPARTMENTS.find((d) => d.id === departmentId)?.defaultAssignee ?? 'PHEE_SAEN'
}

export function isValidAssigneeForDepartment(
  departmentId: DepartmentId,
  assignee: TaskAssignee
): boolean {
  return DEPARTMENT_ASSIGNEES[departmentId]?.includes(assignee) ?? false
}

export const AGENTS = [
  { id: 'CLAUDE' as const, label: 'Claude', role: 'The Brain', color: '#2D5016' },
  { id: 'GEMINI' as const, label: 'Gemini', role: 'The Creative', color: '#C8A84B' },
  { id: 'CURSOR' as const, label: 'Cursor', role: 'The Builder', color: '#1A1A1A' },
] as const
