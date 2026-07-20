import { useEffect, useMemo } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useDeals } from '@/hooks/useDeals'
import { useProposals } from '@/hooks/useProposals'
import { useInvoices } from '@/hooks/useInvoices'
import { useActivity } from '@/hooks/useActivity'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users, Target, DollarSign, FileText } from 'lucide-react'

const STAGE_LABELS: Record<string, string> = {
  lead: 'Lead',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  closed: 'Cerrado',
}

export function DashboardPage() {
  const { contacts, fetchAll: fetchContacts } = useContacts()
  const { deals, fetchAll: fetchDeals } = useDeals()
  const { proposals, fetchAll: fetchProposals } = useProposals()
  const { invoices, fetchAll: fetchInvoices } = useInvoices()
  const { activities, fetchAll: fetchActivity } = useActivity()

  useEffect(() => {
    fetchContacts()
    fetchDeals()
    fetchProposals()
    fetchInvoices()
    fetchActivity()
  }, [fetchContacts, fetchDeals, fetchProposals, fetchInvoices, fetchActivity])

  const stats = useMemo(() => {
    const activeDeals = deals.filter(d => d.stage !== 'closed')
    const pipelineTotal = deals.reduce((sum, d) => sum + (d.value || 0), 0)
    const totalInvoiced = invoices.reduce((sum, i) => sum + (i.amount || 0), 0)
    const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0)
    const totalPending = invoices
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.amount || 0), 0)

    return {
      totalContacts: contacts.length,
      activeDeals: activeDeals.length,
      pipelineTotal,
      totalProposals: proposals.length,
      totalInvoiced,
      totalPending,
      totalPaid,
      totalInvoices: invoices.length,
    }
  }, [contacts, deals, proposals, invoices])

  const statCards = [
    { label: 'Contactos', value: stats.totalContacts, icon: Users },
    { label: 'Deals Activos', value: stats.activeDeals, icon: Target },
    { label: 'Pipeline Total', value: formatCurrency(stats.pipelineTotal), icon: DollarSign },
    { label: 'Propuestas', value: stats.totalProposals, icon: FileText },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen de tu negocio</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {statCards.map(stat => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <stat.icon size={18} className="text-indigo-400" />
              </div>
              <span className="text-slate-400 text-sm">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Deals Recientes</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {deals.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No hay deals aún</p>
            ) : (
              deals.slice(0, 5).map(d => {
                const contact = contacts.find(c => c.id === d.contact_id)
                return (
                  <div key={d.id} className="pb-3 border-b border-slate-700/50 last:border-0">
                    <div className="font-medium text-sm">{d.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {formatCurrency(d.value)} · {STAGE_LABELS[d.stage]} {contact ? `· ${contact.name}` : ''}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-slate-400 mb-4">Actividad</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">Sin actividad reciente</p>
            ) : (
              activities.slice(0, 5).map(a => (
                <div key={a.id} className="pb-3 border-b border-slate-700/50 last:border-0">
                  <div className="text-sm">{a.text}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{formatDate(a.created_at)}</div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
