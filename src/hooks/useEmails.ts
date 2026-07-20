import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Email } from '@/lib/types'
import * as emailsService from '@/services/emails.service'
import * as activityService from '@/services/activity.service'

export function useEmails() {
  const { user } = useAuth()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await emailsService.fetchEmails(user.id)
      setEmails(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addEmail = useCallback(
    async (email: Omit<Email, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      const newEmail = await emailsService.insertEmail(user.id, email)
      setEmails(prev => [newEmail, ...prev])
      await activityService.addActivity(user.id, `Email registrado: "${email.subject}"`)
      return newEmail
    },
    [user]
  )

  const markAsOpened = useCallback(
    async (id: string) => {
      if (!user) return
      await emailsService.updateEmail(user.id, id, {
        opened: true,
        opened_at: new Date().toISOString(),
      })
      setEmails(prev =>
        prev.map(e => (e.id === id ? { ...e, opened: true, opened_at: new Date().toISOString() } : e))
      )
      await activityService.addActivity(user.id, `Email marcado como abierto`)
    },
    [user]
  )

  const removeEmail = useCallback(
    async (id: string) => {
      if (!user) return
      await emailsService.deleteEmail(user.id, id)
      setEmails(prev => prev.filter(e => e.id !== id))
    },
    [user]
  )

  return { emails, loading, fetchAll, addEmail, markAsOpened, removeEmail }
}
