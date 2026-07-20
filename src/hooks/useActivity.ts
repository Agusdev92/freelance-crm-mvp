import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import type { Activity } from '@/lib/types'
import * as activityService from '@/services/activity.service'

export function useActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await activityService.fetchActivity(user.id)
      setActivities(data)
    } finally {
      setLoading(false)
    }
  }, [user])

  const add = useCallback(
    async (text: string) => {
      if (!user) return
      const entry = await activityService.addActivity(user.id, text)
      setActivities(prev => [entry, ...prev].slice(0, 20))
    },
    [user]
  )

  return { activities, loading, fetchAll, add }
}
