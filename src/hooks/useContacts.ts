import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { Contact } from '@/lib/types'
import * as contactsService from '@/services/contacts.service'
import * as activityService from '@/services/activity.service'

export function useContacts() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await contactsService.fetchContacts(user.id)
      setContacts(data)
    } catch {
      addToast('Error al cargar contactos', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, addToast])

  const addContact = useCallback(
    async (contact: Omit<Contact, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      try {
        const newContact = await contactsService.insertContact(user.id, contact)
        setContacts(prev => [newContact, ...prev])
        await activityService.addActivity(user.id, `Contacto "${contact.name}" agregado`)
        addToast('Contacto creado', 'success')
        return newContact
      } catch {
        addToast('Error al crear contacto', 'error')
      }
    },
    [user, addToast]
  )

  const updateContact = useCallback(
    async (id: string, updates: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at'>>) => {
      if (!user) return
      try {
        const updated = await contactsService.updateContact(user.id, id, updates)
        setContacts(prev => prev.map(c => (c.id === id ? updated : c)))
        if (updates.name) {
          await activityService.addActivity(user.id, `Contacto "${updates.name}" actualizado`)
        }
        addToast('Contacto actualizado', 'success')
        return updated
      } catch {
        addToast('Error al actualizar contacto', 'error')
      }
    },
    [user, addToast]
  )

  const removeContact = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        const contact = contacts.find(c => c.id === id)
        await contactsService.deleteContact(user.id, id)
        setContacts(prev => prev.filter(c => c.id !== id))
        if (contact) {
          await activityService.addActivity(user.id, `Contacto "${contact.name}" eliminado`)
        }
        addToast('Contacto eliminado', 'success')
      } catch {
        addToast('Error al eliminar contacto', 'error')
      }
    },
    [user, contacts, addToast]
  )

  return { contacts, loading, fetchAll, addContact, updateContact, removeContact }
}
