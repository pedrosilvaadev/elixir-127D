import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 md:flex">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
