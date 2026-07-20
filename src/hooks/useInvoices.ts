import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { Invoice } from '@/lib/types'
import * as invoicesService from '@/services/invoices.service'
import * as activityService from '@/services/activity.service'

export function useInvoices() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await invoicesService.fetchInvoices(user.id)
      setInvoices(data)
    } catch {
      addToast('Error al cargar facturas', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, addToast])

  const addInvoice = useCallback(
    async (invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      try {
        const newInvoice = await invoicesService.insertInvoice(user.id, invoice)
        setInvoices(prev => [newInvoice, ...prev])
        await activityService.addActivity(user.id, `Factura #${invoice.number} creada`)
        addToast('Factura creada', 'success')
        return newInvoice
      } catch {
        addToast('Error al crear factura', 'error')
      }
    },
    [user, addToast]
  )

  const markPaid = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await invoicesService.updateInvoice(user.id, id, { status: 'paid' })
        setInvoices(prev => prev.map(i => (i.id === id ? { ...i, status: 'paid' as const } : i)))
        await activityService.addActivity(user.id, `Factura marcada como pagada`)
        addToast('Factura marcada como pagada', 'success')
      } catch {
        addToast('Error al marcar factura', 'error')
      }
    },
    [user, addToast]
  )

  const removeInvoice = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await invoicesService.deleteInvoice(user.id, id)
        setInvoices(prev => prev.filter(i => i.id !== id))
        addToast('Factura eliminada', 'success')
      } catch {
        addToast('Error al eliminar factura', 'error')
      }
    },
    [user, addToast]
  )

  return { invoices, loading, fetchAll, addInvoice, markPaid, removeInvoice }
}
