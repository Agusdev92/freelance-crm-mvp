import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Sidebar } from './Sidebar'
import { LoadingPage } from '@/components/ui/Spinner'

export function AppLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) return <LoadingPage />

  if (!user) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
