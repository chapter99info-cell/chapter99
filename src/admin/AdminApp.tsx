import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './components/AdminLayout'
import AdminLogin from './components/AdminLogin'
import ProjectDashboard from './components/ProjectDashboard'
import LiveBriefing from './components/LiveBriefing'
import FinancialExport from './components/FinancialExport'
import TasksHub from './components/TasksHub'
import AdminWorkflowView from './components/AdminWorkflowView'
import ClientJobsKanban from './components/ClientJobsKanban'
import TaxSummaryPanel from './components/TaxSummaryPanel'
import AmsDashboard from './components/ams/AmsDashboard'
import AmsProjectNew from './components/ams/AmsProjectNew'
import AmsProjectDetail from './components/ams/AmsProjectDetail'
import AmsLeads from './components/ams/AmsLeads'
import AmsProtectedRoute from '../ams/AmsProtectedRoute'
import { useAdminManifest, useAdminServiceWorker } from './hooks/useAdminPwa'

function AdminShell() {
  useAdminServiceWorker()
  useAdminManifest()

  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />

        {/* AMS — JWT + ams.staff_profiles only (never PIN via AdminProtectedRoute) */}
        <Route
          path="ams/*"
          element={
            <AmsProtectedRoute roles={['admin']} loginPath="/admin/login">
              <AdminLayout>
                <Routes>
                  <Route index element={<AmsDashboard />} />
                  <Route path="projects/new" element={<AmsProjectNew />} />
                  <Route path="projects/:id" element={<AmsProjectDetail />} />
                  <Route path="leads" element={<AmsLeads />} />
                  <Route path="*" element={<Navigate to="/admin/ams" replace />} />
                </Routes>
              </AdminLayout>
            </AmsProtectedRoute>
          }
        />

        {/* Legacy agency hub — email OR PIN */}
        <Route
          path="*"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route index element={<ProjectDashboard />} />
                  <Route path="briefing" element={<LiveBriefing />} />
                  <Route path="finance" element={<FinancialExport />} />
                  <Route path="jobs" element={<ClientJobsKanban />} />
                  <Route path="tax" element={<TaxSummaryPanel />} />
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
