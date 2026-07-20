import { useEffect, useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useEmails } from '@/hooks/useEmails'
import { useConfirm } from '@/contexts/ConfirmContext'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSection } from '@/components/ui/Spinner'
import { Search, Plus, Trash2, Check } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface EmailForm {
  contact_id: string
  subject: string
  body: string
}

const emptyForm: EmailForm = { contact_id: '', subject: '', body: '' }

export function EmailsPage() {
  const { contacts, fetchAll: fetchContacts } = useContacts()
  const { emails, loading, fetchAll: fetchEmails, addEmail, markAsOpened, removeEmail } = useEmails()
  const { confirm } = useConfirm()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<EmailForm>(emptyForm)

  useEffect(() => {
    fetchContacts()
    fetchEmails()
  }, [fetchContacts, fetchEmails])

  const filtered = emails.filter(e => {
    const q = search.toLowerCase()
    const contact = contacts.find(c => c.id === e.contact_id)
    return (
      (contact?.name || '').toLowerCase().includes(q) ||
      (e.subject || '').toLowerCase().includes(q)
    )
  })

  const contactOptions = contacts.map(c => ({
    value: c.id,
    label: `${c.name} (${c.email})`,
  }))

  const handleSave = async () => {
    await addEmail({
      contact_id: form.contact_id || null,
      subject: form.subject,
      body: form.body || null,
      sent_at: new Date().toISOString(),
      opened: false,
      opened_at: null,
    })
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Email Tracking</h1>
        <Button onClick={() => { setForm(emptyForm); setModalOpen(true) }}>
          <Plus size={16} /> Registrar Email
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar emails..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {loading && emails.length === 0 ? (
        <LoadingSection />
      ) : filtered.length === 0 ? (
        <EmptyState message="No hay emails registrados" />
      ) : (
        <>
          <div className="bg-surface-50 border border-slate-700/50 rounded-2xl overflow-hidden hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Para</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Asunto</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Enviado</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Abierto</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => {
                  const contact = contacts.find(c => c.id === e.contact_id)
                  return (
                    <tr key={e.id} className="border-b border-slate-700/30 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-sm">{contact?.name || 'Desconocido'}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">{e.subject}</td>
                      <td className="px-5 py-4 text-sm text-slate-400">
                        {e.sent_at ? formatDate(e.sent_at) : '-'}
                      </td>
                      <td className="px-5 py-4">
                        {e.opened ? (
                          <span className="text-emerald-400 text-sm font-medium">Abierto</span>
                        ) : (
                          <span className="text-slate-500 text-sm">Pendiente</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          {!e.opened && (
                            <button
                              onClick={() => markAsOpened(e.id)}
                              className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
                              title="Simular apertura"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              const ok = await confirm({
                                title: 'Eliminar email',
                                message: '¿Estás seguro de eliminar este email registrado?',
                                confirmLabel: 'Eliminar',
                              })
                              if (ok) removeEmail(e.id)
                            }}
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

          <div className="md:hidden space-y-3">
            {filtered.map(e => {
              const contact = contacts.find(c => c.id === e.contact_id)
              return (
                <div key={e.id} className="bg-surface-50 border border-slate-700/50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-sm">{e.subject}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{contact?.name || 'Desconocido'}</div>
                    </div>
                    <div className="flex gap-1.5">
                      {!e.opened && (
                        <button
                          onClick={() => markAsOpened(e.id)}
                          className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          const ok = await confirm({
                            title: 'Eliminar email',
                            message: '¿Estás seguro de eliminar este email?',
                            confirmLabel: 'Eliminar',
                          })
                          if (ok) removeEmail(e.id)
                        }}
                        className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{e.sent_at ? formatDate(e.sent_at) : '-'}</span>
                    {e.opened ? (
                      <span className="text-emerald-400 font-medium">Abierto</span>
                    ) : (
                      <span>Pendiente</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Registrar Email Enviado">
        <div className="space-y-4">
          <Select
            label="Contacto *"
            options={[{ value: '', label: 'Seleccionar contacto' }, ...contactOptions]}
            value={form.contact_id}
            onChange={e => setForm(f => ({ ...f, contact_id: e.target.value }))}
          />
          <Input
            label="Asunto *"
            value={form.subject}
            onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
          />
          <Textarea
            label="Cuerpo del email"
            rows={4}
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Registrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
