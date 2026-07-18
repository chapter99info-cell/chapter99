import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App'
import { useServiceWorker } from './hooks/usePwa'
import { LanguageProvider } from './i18n/LanguageContext'

const AdminApp = lazy(() => import('./admin/AdminApp'))
const PortalApp = lazy(() => import('./portal/PortalApp'))
const TrackApp = lazy(() => import('./ams/TrackApp'))
const StaffApp = lazy(() => import('./ams/StaffApp'))

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
        <Route
          path="/"
          element={
            <LanguageProvider>
              <App />
            </LanguageProvider>
          }
        />
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
        <Route
          path="/track/*"
          element={
            <Suspense fallback={<PageFallback />}>
              <TrackApp />
            </Suspense>
          }
        />
        <Route
          path="/staff/*"
          element={
            <Suspense fallback={<PageFallback />}>
              <StaffApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
