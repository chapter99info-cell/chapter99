import { Route, Routes } from 'react-router-dom'
import ClientPortalPage from './ClientPortalPage'

/** Client portal routes — no admin or AI modules */
export default function PortalApp() {
  return (
    <Routes>
      <Route path=":projectId" element={<ClientPortalPage />} />
    </Routes>
  )
}
