import { useEffect, useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useInvoices } from '@/hooks/useInvoices'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSection } from '@/components/ui/Spinner'
import { Plus, Check, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { InvoiceStatus } from '@/lib/types'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'overdue', label: 'Vencido' },
  { value: 'cancelled', label: 'Cancelado' },
]

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
}

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  pending: 'text-amber-400',
  paid: 'text-emerald-400',
  overdue: 'text-red-400',
  cancelled: 'text-slate-500',
}

interface InvoiceForm {
  contact_id: string
  number: string
  concept: string
  amount: string
  due_date: string
  status: InvoiceStatus
  notes: string
}

const emptyForm: InvoiceForm = {
  contact_id: '',
  number: '',
  concept: '',
  amount: '',
  due_date: '',
  status: 'pending',
  notes: '',
}

export function InvoicesPage() {
  const { contacts, fetchAll: fetchContacts } = useContacts()
  const { invoices, loading, fetchAll: fetchInvoices, addInvoice, markPaid, removeInvoice } = useInvoices()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<InvoiceForm>(emptyForm)

  useEffect(() => {
    fetchContacts()
    fetchInvoices()
  }, [fetchContacts, fetchInvoices])

  const stats = {
    totalInvoiced: invoices.reduce((sum, i) => sum + (i.amount || 0), 0),
    totalPending: invoices
      .filter(i => i.status === 'pending' || i.status === 'overdue')
      .reduce((sum, i) => sum + (i.amount || 0), 0),
    totalPaid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0),
    totalInvoices: invoices.length,
  }

  const statCards = [
    { label: 'Total Facturado', value: formatCurrency(stats.totalInvoiced) },
    { label: 'Pendiente', value: formatCurrency(stats.totalPending) },
    { label: 'Pagado', value: formatCurrency(stats.totalPaid) },
    { label: 'Facturas', value: String(stats.totalInvoices) },
  ]

  const contactOptions = [
    { value: '', label: 'Seleccionar contacto' },
    ...contacts.map(c => ({ value: c.id, label: c.name })),
  ]

  const handleSave = async () => {
    const number = form.number || `INV-${Date.now().toString().slice(-6)}`
    await addInvoice({
      contact_id: form.contact_id || null,
      number,
      concept: form.concept,
      amount: parseFloat(form.amount) || 0,
      due_date: form.due_date || null,
      status: form.status,
      notes: form.notes || null,
    })
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Facturación</h1>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true) }}>
          <Plus size={16} /> Nueva Factura
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-8">
        {statCards.map(stat => (
          <Card key={stat.label} className="p-5">
            <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
            <div className="text-xl font-bold">{stat.value}</div>
          </Card>
        ))}
      </div>

      {loading && invoices.length === 0 ? (
        <LoadingSection />
      ) : invoices.length === 0 ? (
        <EmptyState message="No hay facturas aún" />
      ) : (
        <div className="bg-surface-50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Cliente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Concepto</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Monto</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Estado</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Vencimiento</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const contact = contacts.find(c => c.id === inv.contact_id)
                return (
                  <tr key={inv.id} className="border-b border-slate-700/30 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-400">{inv.number || `#${inv.id.slice(-6)}`}</td>
                    <td className="px-5 py-4 text-sm">{contact?.name || '-'}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{inv.concept}</td>
                    <td className="px-5 py-4 text-sm font-semibold">{formatCurrency(inv.amount)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-medium ${STATUS_COLORS[inv.status]}`}>
                        {STATUS_LABELS[inv.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-400">
                      {inv.due_date ? formatDate(inv.due_date) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => markPaid(inv.id)}
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Marcar pagado"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => removeInvoice(inv.id)}
                          className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nueva Factura">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cliente *"
              options={contactOptions}
              value={form.contact_id}
              onChange={e => setForm(f => ({ ...f, contact_id: e.target.value }))}
            />
            <Input
              label="Número"
              value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              placeholder="Auto-generado"
            />
          </div>
          <Input
            label="Concepto *"
            value={form.concept}
            onChange={e => setForm(f => ({ ...f, concept: e.target.value }))}
            placeholder="Ej: Desarrollo web landing page"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monto ($)"
              type="number"
              min={0}
              step={100}
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
            <Input
              label="Vencimiento"
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
            />
          </div>
          <Select
            label="Estado"
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as InvoiceStatus }))}
          />
          <Textarea
            label="Notas"
            rows={2}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
