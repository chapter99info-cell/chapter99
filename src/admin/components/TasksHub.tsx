import { useState } from 'react'
import { DEPARTMENTS, type DepartmentId } from '../../lib/departmentConfig'
import { brandColor } from '../../lib/useBrand'
import AgentPanels from './AgentPanels'
import TaskBoard from './TaskBoard'

/** Department task board + AI agent panels (admin-only AI) */
export default function TasksHub() {
  const [activeDept, setActiveDept] = useState<DepartmentId>(1)
  const primary = brandColor('primary')

  return (
    <div>
      <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
        Task Board
      </h2>
      <p className="mt-2 text-base" style={{ color: brandColor('textMuted') }}>
        9 departments — tasks and AI prompts saved to Supabase
      </p>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-2" aria-label="Departments">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setActiveDept(dept.id)}
            className="shrink-0 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors"
            style={
              activeDept === dept.id
                ? { borderColor: primary, backgroundColor: primary, color: '#fff' }
                : { borderColor: brandColor('border'), backgroundColor: '#fff', color: brandColor('text') }
            }
          >
            {dept.name}
          </button>
        ))}
      </nav>

      <TaskBoard key={`tasks-${activeDept}`} departmentId={activeDept} />
      <AgentPanels key={`agents-${activeDept}`} activeDepartment={activeDept} />
    </div>
  )
}
