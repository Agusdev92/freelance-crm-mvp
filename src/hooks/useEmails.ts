import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { Email } from '@/lib/types'
import * as emailsService from '@/services/emails.service'
import * as activityService from '@/services/activity.service'

export function useEmails() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await emailsService.fetchEmails(user.id)
      setEmails(data)
    } catch {
      addToast('Error al cargar emails', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, addToast])

  const addEmail = useCallback(
    async (email: Omit<Email, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      try {
        const newEmail = await emailsService.insertEmail(user.id, email)
        setEmails(prev => [newEmail, ...prev])
        await activityService.addActivity(user.id, `Email registrado: "${email.subject}"`)
        addToast('Email registrado', 'success')
        return newEmail
      } catch {
        addToast('Error al registrar email', 'error')
      }
    },
    [user, addToast]
  )

  const markAsOpened = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await emailsService.updateEmail(user.id, id, {
          opened: true,
          opened_at: new Date().toISOString(),
        })
        setEmails(prev =>
          prev.map(e =>
            e.id === id ? { ...e, opened: true, opened_at: new Date().toISOString() } : e
          )
        )
        await activityService.addActivity(user.id, `Email marcado como abierto`)
        addToast('Email marcado como abierto', 'success')
      } catch {
        addToast('Error al marcar email', 'error')
      }
    },
    [user, addToast]
  )

  const removeEmail = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await emailsService.deleteEmail(user.id, id)
        setEmails(prev => prev.filter(e => e.id !== id))
        addToast('Email eliminado', 'success')
      } catch {
        addToast('Error al eliminar email', 'error')
      }
    },
    [user, addToast]
  )

  return { emails, loading, fetchAll, addEmail, markAsOpened, removeEmail }
}
