import { Navigate, Route, Routes } from 'react-router-dom'
import TrackPage from './pages/TrackPage'

export default function TrackApp() {
  return (
    <Routes>
      <Route path=":publicToken" element={<TrackPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
