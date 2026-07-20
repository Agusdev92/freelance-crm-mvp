import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Invoice } from '@/lib/types'
import * as invoicesService from '@/services/invoices.service'
import * as activityService from '@/services/activity.service'

export function useInvoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await invoicesService.fetchInvoices(user.id)
      setInvoices(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addInvoice = useCallback(
    async (invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      const newInvoice = await invoicesService.insertInvoice(user.id, invoice)
      setInvoices(prev => [newInvoice, ...prev])
      await activityService.addActivity(user.id, `Factura #${invoice.number} creada`)
      return newInvoice
    },
    [user]
  )

  const markPaid = useCallback(
    async (id: string) => {
      if (!user) return
      await invoicesService.updateInvoice(user.id, id, { status: 'paid' })
      setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status: 'paid' as const } : i)))
      await activityService.addActivity(user.id, `Factura marcada como pagada`)
    },
    [user]
  )

  const removeInvoice = useCallback(
    async (id: string) => {
      if (!user) return
      await invoicesService.deleteInvoice(user.id, id)
      setInvoices(prev => prev.filter(i => i.id !== id))
    },
    [user]
  )

  return { invoices, loading, fetchAll, addInvoice, markPaid, removeInvoice }
}
