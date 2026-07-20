import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Proposal } from '@/lib/types'
import * as proposalsService from '@/services/proposals.service'
import * as activityService from '@/services/activity.service'

export function useProposals() {
  const { user } = useAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await proposalsService.fetchProposals(user.id)
      setProposals(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const generateAndSave = useCallback(
    async (input: import('@/lib/types').ProposalInput) => {
      if (!user) return
      setLoading(true)
      try {
        const content = await proposalsService.generateProposal(input)
        const TYPE_LABELS: Record<string, string> = {
          web: 'Desarrollo Web',
          design: 'Diseño',
          consulting: 'Consultoría',
          marketing: 'Marketing',
          other: 'Servicio',
        }
        const proposalData: Omit<Proposal, 'id' | 'user_id' | 'created_at'> = {
          project: input.project,
          client: input.client || null,
          type: TYPE_LABELS[input.type] || input.type,
          budget: input.budget ?? null,
          duration: input.duration || null,
          description: input.description || null,
          content,
          date: new Date().toLocaleDateString('es-ES'),
        }
        const saved = await proposalsService.insertProposal(user.id, proposalData)
        setProposals(prev => [saved, ...prev])
        await activityService.addActivity(user.id, `Propuesta "${input.project}" generada`)
        return saved
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  const removeProposal = useCallback(
    async (id: string) => {
      if (!user) return
      await proposalsService.deleteProposal(user.id, id)
      setProposals(prev => prev.filter(p => p.id !== id))
    },
    [user]
  )

  return { proposals, loading, fetchAll, generateAndSave, removeProposal }
}
