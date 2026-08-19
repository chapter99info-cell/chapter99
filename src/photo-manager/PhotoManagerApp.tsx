import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PhotoStoreProvider, usePhotoStore } from './store/StoreContext'
import LoginPage from './pages/LoginPage'
import Shell from './pages/Shell'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import CalendarPage from './pages/CalendarPage'
import { BriefPage, EmailPage, GalleryPage, TimelinePage, VendorsPage } from './pages/OpsPages'
import { ContractPage, InvoicePage, QuotePage } from './pages/DocsPages'
import TaxPage from './pages/TaxPage'
import PackagesPage from './pages/PackagesPage'
import ConfirmPage from './pages/ConfirmPage'
import BrandPage from './pages/BrandPage'
import './styles.css'

function Fonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </>
  )
}

function Guard({ children }: { children: ReactNode }) {
  const { ready, error } = usePhotoStore()
  if (!ready) return <div className="login-wrap">กำลังโหลด Photo Manager…</div>
  if (error) return <div className="login-wrap">{error}</div>
  return <>{children}</>
}

function Inner() {
  return (
    <Guard>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="confirm/:token" element={<ConfirmPage />} />
        <Route element={<Shell />}>
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="contract" element={<ContractPage />} />
          <Route path="quote" element={<QuotePage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="brief" element={<BriefPage />} />
          <Route path="email" element={<EmailPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="packages" element={<OwnerPackages />} />
          <Route path="tax" element={<OwnerTax />} />
          <Route path="brand" element={<OwnerBrand />} />
        </Route>
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </Guard>
  )
}

function OwnerPackages() {
  const { isOwner } = usePhotoStore()
  if (!isOwner) return <Navigate to="/pm" replace />
  return <PackagesPage />
}

function OwnerTax() {
  const { isOwner } = usePhotoStore()
  if (!isOwner) return <Navigate to="/pm" replace />
  return <TaxPage />
}

function OwnerBrand() {
  const { isOwner } = usePhotoStore()
  if (!isOwner) return <Navigate to="/pm" replace />
  return <BrandPage />
}

export default function PhotoManagerApp() {
  return (
    <div className="pm-root">
      <Fonts />
      <PhotoStoreProvider>
        <Inner />
      </PhotoStoreProvider>
    </div>
  )
}
