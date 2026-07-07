import { useState } from 'react'
import { DEPARTMENTS, type DepartmentId } from '../../lib/departmentConfig'
import AgentPanels from './AgentPanels'
import TaskBoard from './TaskBoard'

export default function AdminDashboard() {
  const [activeDept, setActiveDept] = useState<DepartmentId>(1)

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A1A]">Agency Dashboard</h2>
      <p className="mt-2 text-base text-[#6B7280]">
        9 departments — tasks and AI prompts are saved to Supabase
      </p>

      <nav
        className="mt-6 flex gap-2 overflow-x-auto pb-2"
        aria-label="Departments"
      >
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setActiveDept(dept.id)}
            className={`shrink-0 rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-colors ${
              activeDept === dept.id
                ? 'border-[#2D5016] bg-[#2D5016] text-white'
                : 'border-[#1A1A1A]/20 bg-white text-[#1A1A1A] hover:border-[#2D5016]'
            }`}
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
