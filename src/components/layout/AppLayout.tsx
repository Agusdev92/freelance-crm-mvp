import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from './Sidebar'
import { LoadingPage } from '@/components/ui/Spinner'
import { Menu } from 'lucide-react'

export function AppLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) return <LoadingPage />

  if (!user) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2.5 rounded-xl bg-surface-50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-indigo-500 transition-colors cursor-pointer"
      >
        <Menu size={20} />
      </button>

      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:p-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}
