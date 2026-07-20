import { useEffect, useState, useCallback } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useDeals } from '@/hooks/useDeals'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Deal, DealStage } from '@/lib/types'

const STAGES: { key: DealStage; label: string }[] = [
  { key: 'lead', label: 'Leads' },
  { key: 'proposal', label: 'Propuesta' },
  { key: 'negotiation', label: 'Negociación' },
  { key: 'closed', label: 'Cerrado' },
]

const STAGE_OPTIONS = STAGES.map(s => ({ value: s.key, label: s.label }))

interface DealForm {
  name: string
  contact_id: string
  value: string
  stage: DealStage
  notes: string
}

const emptyForm: DealForm = { name: '', contact_id: '', value: '', stage: 'lead', notes: '' }

export function PipelinePage() {
  const { contacts, fetchAll: fetchContacts } = useContacts()
  const { deals, fetchAll: fetchDeals, addDeal, updateDeal, removeDeal } = useDeals()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DealForm>(emptyForm)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null)

  useEffect(() => {
    fetchContacts()
    fetchDeals()
  }, [fetchContacts, fetchDeals])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (deal: Deal) => {
    setEditingId(deal.id)
    setForm({
      name: deal.name,
      contact_id: deal.contact_id || '',
      value: deal.value ? String(deal.value) : '',
      stage: deal.stage,
      notes: deal.notes || '',
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const data = {
      name: form.name,
      contact_id: form.contact_id || null,
      value: parseFloat(form.value) || 0,
      stage: form.stage,
      notes: form.notes || null,
    }

    if (editingId) {
      await updateDeal(editingId, data)
    } else {
      await addDeal(data)
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar deal "${name}"?`)) return
    await removeDeal(id)
  }

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedId(null)
    setDragOverStage(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, stage: DealStage) => {
    e.preventDefault()
    setDragOverStage(stage)
  }, [])

  const handleDrop = useCallback(
    async (stage: DealStage) => {
      if (!draggedId) return
      const deal = deals.find(d => d.id === draggedId)
      if (deal && deal.stage !== stage) {
        await updateDeal(draggedId, { stage })
      }
      setDraggedId(null)
      setDragOverStage(null)
    },
    [draggedId, deals, updateDeal]
  )

  const contactOptions = [
    { value: '', label: 'Sin contacto' },
    ...contacts.map(c => ({ value: c.id, label: c.name })),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <Button onClick={openNew}>
          <Plus size={16} /> Nuevo Deal
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-5 min-h-[500px]">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.key)
          return (
            <div
              key={stage.key}
              className={`bg-surface-50 border rounded-2xl p-4 transition-colors ${
                dragOverStage === stage.key
                  ? 'border-indigo-500/50 bg-indigo-500/5'
                  : 'border-slate-700/50'
              }`}
              onDragOver={e => handleDragOver(e, stage.key)}
              onDrop={() => handleDrop(stage.key)}
              onDragLeave={() => setDragOverStage(null)}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/50">
                <h3 className="text-sm font-semibold">{stage.label}</h3>
                <span className="px-2.5 py-0.5 rounded-lg bg-surface-200 text-xs font-semibold">
                  {stageDeals.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {stageDeals.length === 0 ? (
                  <EmptyState message="Sin deals" />
                ) : (
                  stageDeals.map(deal => {
                    const contact = contacts.find(c => c.id === deal.contact_id)
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal.id)}
                        onDragEnd={handleDragEnd}
                        className={`bg-surface-200 border border-slate-700/50 rounded-xl p-4 cursor-grab transition-all hover:border-indigo-500 hover:-translate-y-0.5 ${
                          draggedId === deal.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="font-medium text-sm mb-2">{deal.name}</div>
                        <div className="text-emerald-400 font-bold text-base mb-1">
                          {deal.value ? formatCurrency(deal.value) : '-'}
                        </div>
                        <div className="text-slate-500 text-xs mb-3">
                          {contact ? contact.name : 'Sin contacto'}
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openEdit(deal)}
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id, deal.name)}
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Deal' : 'Nuevo Deal'}
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Deal *"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Contacto"
              options={contactOptions}
              value={form.contact_id}
              onChange={e => setForm(f => ({ ...f, contact_id: e.target.value }))}
            />
            <Input
              label="Valor ($)"
              type="number"
              min={0}
              step={100}
              value={form.value}
              onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
            />
          </div>
          <Select
            label="Etapa"
            options={STAGE_OPTIONS}
            value={form.stage}
            onChange={e => setForm(f => ({ ...f, stage: e.target.value as DealStage }))}
          />
          <Textarea
            label="Notas"
            rows={3}
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
