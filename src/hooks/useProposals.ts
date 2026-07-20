import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useToast } from '@/contexts/ToastContext'
import type { Proposal, ProposalInput } from '@/lib/types'
import * as proposalsService from '@/services/proposals.service'
import * as activityService from '@/services/activity.service'

export function useProposals() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await proposalsService.fetchProposals(user.id)
      setProposals(data)
    } catch {
      addToast('Error al cargar propuestas', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, addToast])

  const generateAndSave = useCallback(
    async (input: ProposalInput) => {
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
        addToast('Propuesta generada', 'success')
        return saved
      } catch {
        addToast('Error al generar propuesta', 'error')
      } finally {
        setLoading(false)
      }
    },
    [user, addToast]
  )

  const removeProposal = useCallback(
    async (id: string) => {
      if (!user) return
      try {
        await proposalsService.deleteProposal(user.id, id)
        setProposals(prev => prev.filter(p => p.id !== id))
        addToast('Propuesta eliminada', 'success')
      } catch {
        addToast('Error al eliminar propuesta', 'error')
      }
    },
    [user, addToast]
  )

  return { proposals, loading, fetchAll, generateAndSave, removeProposal }
}
