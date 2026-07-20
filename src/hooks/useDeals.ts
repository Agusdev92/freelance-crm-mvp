import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Deal, DealStage } from '@/lib/types'
import * as dealsService from '@/services/deals.service'
import * as activityService from '@/services/activity.service'

const STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  closed: 'Cerrado',
}

export function useDeals() {
  const { user } = useAuth()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await dealsService.fetchDeals(user.id)
      setDeals(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addDeal = useCallback(
    async (deal: Omit<Deal, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) return
      const newDeal = await dealsService.insertDeal(user.id, deal)
      setDeals(prev => [newDeal, ...prev])
      await activityService.addActivity(user.id, `Deal "${deal.name}" creado`)
      return newDeal
    },
    [user]
  )

  const updateDeal = useCallback(
    async (id: string, updates: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at'>>) => {
      if (!user) return
      const updated = await dealsService.updateDeal(user.id, id, updates)
      setDeals(prev => prev.map(d => (d.id === id ? updated : d)))
      if (updates.stage) {
        const deal = deals.find(d => d.id === id)
        if (deal) {
          await activityService.addActivity(
            user.id,
            `Deal "${deal.name}" movido a ${STAGE_LABELS[updates.stage]}`
          )
        }
      }
      return updated
    },
    [user, deals]
  )

  const removeDeal = useCallback(
    async (id: string) => {
      if (!user) return
      const deal = deals.find(d => d.id === id)
      await dealsService.deleteDeal(user.id, id)
      setDeals(prev => prev.filter(d => d.id !== id))
      if (deal) {
        await activityService.addActivity(user.id, `Deal "${deal.name}" eliminado`)
      }
    },
    [user, deals]
  )

  return { deals, loading, fetchAll, addDeal, updateDeal, removeDeal }
}
