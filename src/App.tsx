import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { MainLayout } from '@/components/layout/MainLayout'
import { Onboarding } from '@/features/onboarding/Onboarding'
import { Dashboard } from '@/pages/Dashboard'

function AppRoutes() {
  const profile = useStore((s) => s.profile)

  if (!profile) {
    return (
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
