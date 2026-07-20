import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/contexts/ToastContext'
import { ConfirmProvider } from '@/contexts/ConfirmContext'
import { ToastContainer } from '@/components/ui/Toast'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { PipelinePage } from '@/pages/PipelinePage'
import { ProposalsPage } from '@/pages/ProposalsPage'
import { EmailsPage } from '@/pages/EmailsPage'
import { InvoicesPage } from '@/pages/InvoicesPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <BrowserRouter>
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
          </BrowserRouter>
          <ToastContainer />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
