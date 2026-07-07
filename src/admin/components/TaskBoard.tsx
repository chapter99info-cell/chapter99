import { useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getDepartmentName } from '../../lib/departmentConfig'
import { createTask, deleteTask, ensureDefaultProject, fetchTasks, updateTaskStatus } from '../../lib/agencyService'
import type { Task, TaskStatus } from '../../types/agency'
import { getDefaultAssignee, type DepartmentId } from '../../lib/departmentConfig'

const BOARD_COLUMNS: { key: TaskStatus[]; label: string }[] = [
  { key: ['TODO'], label: 'To Do' },
  { key: ['DOING', 'IN_REVIEW'], label: 'In Progress' },
  { key: ['DONE'], label: 'Done' },
]

interface TaskBoardProps {
  departmentId: DepartmentId
}

export default function TaskBoard({ departmentId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projectId, setProjectId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newTitle, setNewTitle] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const pid = await ensureDefaultProject()
      setProjectId(pid)
      const all = await fetchTasks(pid)
      setTasks(all.filter((t) => t.departmentId === departmentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [departmentId])

  useEffect(() => {
    void load()
  }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !projectId) return
    try {
      await createTask({
        projectId,
        departmentId,
        assignee: getDefaultAssignee(departmentId),
        status: 'TODO',
        title: newTitle.trim(),
        promptOrSpec: '',
        notes: '',
      })
      setNewTitle('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
    }
  }

  async function moveTask(task: Task, newStatus: TaskStatus) {
    try {
      await updateTaskStatus(task.id, newStatus)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  if (loading) {
    return <p className="text-base text-[#6B7280]">Loading tasks…</p>
  }

  return (
    <section className="mt-6">
      <h3 className="text-lg font-bold text-[#1A1A1A]">Task Board — {getDepartmentName(departmentId)}</h3>
      {error && (
        <p className="mt-2 rounded-lg border border-red-300 bg-red-50 p-3 text-base text-red-800">{error}</p>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task title…"
          className="flex-1 rounded-lg border-2 border-[#1A1A1A]/20 px-4 py-3 text-base focus:border-[#2D5016] focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#2D5016] px-5 py-3 text-base font-bold text-white"
        >
          <Plus className="h-5 w-5" />
          Add Task
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {BOARD_COLUMNS.map((col) => (
          <div key={col.label} className="rounded-xl border-2 border-[#1A1A1A]/15 bg-white p-4">
            <h4 className="mb-4 text-base font-bold text-[#2D5016]">{col.label}</h4>
            <ul className="space-y-3">
              {tasks
                .filter((t) => col.key.includes(t.status))
                .map((task) => (
                  <li
                    key={task.id}
                    className="rounded-lg border border-[#1A1A1A]/10 bg-[#F8F5F0] p-3"
                  >
                    <p className="text-base font-semibold text-[#1A1A1A]">{task.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">Assignee: {task.assignee}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {col.key[0] !== 'TODO' && (
                        <button
                          type="button"
                          onClick={() =>
                            moveTask(
                              task,
                              col.label === 'Done' ? 'DOING' : 'TODO'
                            )
                          }
                          className="rounded border border-[#1A1A1A]/30 px-2 py-1 text-sm font-medium"
                        >
                          ← Back
                        </button>
                      )}
                      {col.label !== 'Done' && (
                        <button
                          type="button"
                          onClick={() =>
                            moveTask(
                              task,
                              col.label === 'To Do' ? 'DOING' : 'DONE'
                            )
                          }
                          className="rounded border border-[#2D5016] bg-[#2D5016] px-2 py-1 text-sm font-medium text-white"
                        >
                          Forward →
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="rounded border border-red-400 px-2 py-1 text-sm text-red-700"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              {tasks.filter((t) => col.key.includes(t.status)).length === 0 && (
                <li className="text-sm text-[#6B7280]">No tasks</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
