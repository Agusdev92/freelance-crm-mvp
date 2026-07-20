import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Contact } from '@/lib/types'
import * as contactsService from '@/services/contacts.service'
import * as activityService from '@/services/activity.service'

export function useContacts() {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await contactsService.fetchContacts(user.id)
      setContacts(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addContact = useCallback(
    async (contact: Omit<Contact, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      const newContact = await contactsService.insertContact(user.id, contact)
      setContacts(prev => [newContact, ...prev])
      await activityService.addActivity(user.id, `Contacto "${contact.name}" agregado`)
      return newContact
    },
    [user]
  )

  const updateContact = useCallback(
    async (id: string, updates: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at'>>) => {
      if (!user) return
      const updated = await contactsService.updateContact(user.id, id, updates)
      setContacts(prev => prev.map(c => (c.id === id ? updated : c)))
      if (updates.name) {
        await activityService.addActivity(user.id, `Contacto "${updates.name}" actualizado`)
      }
      return updated
    },
    [user]
  )

  const removeContact = useCallback(
    async (id: string) => {
      if (!user) return
      const contact = contacts.find(c => c.id === id)
      await contactsService.deleteContact(user.id, id)
      setContacts(prev => prev.filter(c => c.id !== id))
      if (contact) {
        await activityService.addActivity(user.id, `Contacto "${contact.name}" eliminado`)
      }
    },
    [user, contacts]
  )

  return { contacts, loading, fetchAll, addContact, updateContact, removeContact }
}
