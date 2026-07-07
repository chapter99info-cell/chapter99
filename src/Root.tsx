import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import { useServiceWorker } from './hooks/usePwa'

const AdminApp = lazy(() => import('./admin/AdminApp'))
const PortalApp = lazy(() => import('./portal/PortalApp'))

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5F0] text-lg text-[#1A1A1A]">
      Loading…
    </div>
  )
}

export default function Root() {
  useServiceWorker()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/p/*"
          element={
            <Suspense fallback={<PageFallback />}>
              <PortalApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
