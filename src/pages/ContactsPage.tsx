import { useEffect, useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSection } from '@/components/ui/Spinner'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import type { Contact } from '@/lib/types'

const emptyContact: Omit<Contact, 'id' | 'user_id' | 'created_at'> = {
  name: '',
  email: '',
  company: null,
  phone: null,
  tags: [],
  notes: null,
}

export function ContactsPage() {
  const { contacts, loading, fetchAll, addContact, updateContact, removeContact } = useContacts()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyContact)
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.tags || []).some(t => t.toLowerCase().includes(q))
    )
  })

  const openNew = () => {
    setEditingId(null)
    setForm(emptyContact)
    setTagsInput('')
    setModalOpen(true)
  }

  const openEdit = (contact: Contact) => {
    setEditingId(contact.id)
    setForm({
      name: contact.name,
      email: contact.email,
      company: contact.company,
      phone: contact.phone,
      tags: contact.tags,
      notes: contact.notes,
    })
    setTagsInput((contact.tags || []).join(', '))
    setModalOpen(true)
  }

  const handleSave = async () => {
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    const data = { ...form, tags }

    if (editingId) {
      await updateContact(editingId, data)
    } else {
      await addContact(data)
    }
    setModalOpen(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar contacto "${name}"?`)) return
    await removeContact(id)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Contactos</h1>
        <Button onClick={openNew}>
          <Plus size={16} /> Nuevo Contacto
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Buscar contactos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {loading && contacts.length === 0 ? (
        <LoadingSection />
      ) : filtered.length === 0 ? (
        <EmptyState message="No hay contactos. ¡Agrega uno!" />
      ) : (
        <div className="bg-surface-50 border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Nombre</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Empresa</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Tags</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-indigo-500/5">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-slate-700/30 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 font-medium text-sm">{c.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{c.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">{c.company || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {(c.tags || []).map(t => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Contacto' : 'Nuevo Contacto'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Email *"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Empresa"
              value={form.company || ''}
              onChange={e => setForm(f => ({ ...f, company: e.target.value || null }))}
            />
            <Input
              label="Teléfono"
              value={form.phone || ''}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value || null }))}
            />
          </div>
          <Input
            label="Tags (separados por coma)"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="diseño, web, urgente"
          />
          <Textarea
            label="Notas"
            rows={3}
            value={form.notes || ''}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
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
