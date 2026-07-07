import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './components/AdminLogin'
import ProjectDashboard from './components/ProjectDashboard'
import ProjectSettings from './components/ProjectSettings'
import LiveBriefing from './components/LiveBriefing'
import FinancialExport from './components/FinancialExport'
import TasksHub from './components/TasksHub'
import AdminWorkflowView from './components/AdminWorkflowView'
import { useAdminManifest, useAdminServiceWorker } from './hooks/useAdminPwa'

function AdminShell() {
  useAdminServiceWorker()
  useAdminManifest()

  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          path="*"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<ProjectDashboard />} />
                  <Route path="projects/:projectId/settings" element={<ProjectSettings />} />
                  <Route path="briefing" element={<LiveBriefing />} />
                  <Route path="finance" element={<FinancialExport />} />
                  <Route path="tasks" element={<TasksHub />} />
                  <Route path="workflow" element={<AdminWorkflowView />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </AdminAuthProvider>
  )
}

export default function AdminApp() {
  return <AdminShell />
}
