import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/contexts/ToastContext'
import { ConfirmProvider } from '@/contexts/ConfirmContext'
import { ToastContainer } from '@/components/ui/Toast'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { Spinner } from '@/components/ui/Spinner'

const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ContactsPage = lazy(() => import('@/pages/ContactsPage').then(m => ({ default: m.ContactsPage })))
const PipelinePage = lazy(() => import('@/pages/PipelinePage').then(m => ({ default: m.PipelinePage })))
const ProposalsPage = lazy(() => import('@/pages/ProposalsPage').then(m => ({ default: m.ProposalsPage })))
const EmailsPage = lazy(() => import('@/pages/EmailsPage').then(m => ({ default: m.EmailsPage })))
const InvoicesPage = lazy(() => import('@/pages/InvoicesPage').then(m => ({ default: m.InvoicesPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size={28} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/contacts" element={<ContactsPage />} />
                  <Route path="/pipeline" element={<PipelinePage />} />
                  <Route path="/proposals" element={<ProposalsPage />} />
                  <Route path="/emails" element={<EmailsPage />} />
                  <Route path="/invoices" element={<InvoicesPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
