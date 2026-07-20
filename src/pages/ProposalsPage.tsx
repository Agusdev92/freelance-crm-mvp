import { useEffect, useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useProposals } from '@/hooks/useProposals'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSection, Spinner } from '@/components/ui/Spinner'
import { Plus, FileText, Copy, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const SERVICE_TYPES = [
  { value: 'web', label: 'Desarrollo Web' },
  { value: 'design', label: 'Diseño' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'other', label: 'Otro' },
]

interface ProposalForm {
  project: string
  client: string
  type: string
  budget: string
  duration: string
  description: string
}

const emptyForm: ProposalForm = {
  project: '',
  client: '',
  type: 'web',
  budget: '',
  duration: '',
  description: '',
}

export function ProposalsPage() {
  const { contacts, fetchAll: fetchContacts } = useContacts()
  const { proposals, loading, fetchAll: fetchProposals, generateAndSave, removeProposal } = useProposals()
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState('')
  const [form, setForm] = useState<ProposalForm>(emptyForm)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchContacts()
    fetchProposals()
  }, [fetchContacts, fetchProposals])

  const clientOptions = [
    { value: '', label: 'Sin cliente' },
    ...contacts.map(c => ({ value: c.name, label: c.name })),
  ]

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await generateAndSave({
        project: form.project,
        client: form.client || undefined,
        type: form.type,
        budget: form.budget ? parseInt(form.budget) : undefined,
        duration: form.duration || undefined,
        description: form.description || undefined,
      })
      setModalOpen(false)
    } finally {
      setGenerating(false)
    }
  }

  const viewProposal = (content: string) => {
    setSelectedContent(content)
    setDetailOpen(true)
  }

  const copyProposal = () => {
    navigator.clipboard.writeText(selectedContent)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta propuesta?')) return
    await removeProposal(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Propuestas</h1>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true) }}>
          <Plus size={16} /> Generar Propuesta
        </Button>
      </div>

      {loading && proposals.length === 0 ? (
        <LoadingSection />
      ) : proposals.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} message="No hay propuestas aún. ¡Genera una con IA!" />
      ) : (
        <div className="space-y-4">
          {proposals.map(p => (
            <div
              key={p.id}
              className="bg-surface-50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors cursor-pointer"
              onClick={() => p.content && viewProposal(p.content)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-semibold mb-1">{p.project}</div>
                  <div className="flex gap-4 text-sm text-slate-400">
                    <span>{p.type}</span>
                    <span>{p.budget ? `$${p.budget.toLocaleString()}` : '-'}</span>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-slate-500 text-xs mt-2">
                {p.client ? `Cliente: ${p.client}` : 'Sin cliente'} ·{' '}
                {p.date || formatDate(p.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Generar Propuesta con IA">
        <div className="space-y-4">
          <Input
            label="Nombre del Proyecto *"
            value={form.project}
            onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Cliente"
              options={clientOptions}
              value={form.client}
              onChange={e => setForm(f => ({ ...f, client: e.target.value }))}
            />
            <Select
              label="Tipo de Servicio"
              options={SERVICE_TYPES}
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Presupuesto ($)"
              type="number"
              min={0}
              step={100}
              value={form.budget}
              onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
            />
            <Input
              label="Duración"
              value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="ej: 2 semanas"
            />
          </div>
          <Textarea
            label="Descripción del Proyecto"
            rows={4}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe brevemente el proyecto, objetivos y alcance..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? <><Spinner size={16} /> Generando...</> : 'Generar Propuesta'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Propuesta">
        <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap mb-4">
          {selectedContent}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={copyProposal}>
            <Copy size={14} /> Copiar
          </Button>
          <Button onClick={() => setDetailOpen(false)}>Cerrar</Button>
        </div>
      </Modal>
    </div>
  )
}
