import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Activity } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_activity_${userId}`
}

export async function fetchActivity(userId: string): Promise<Activity[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) throw error
    return (data ?? []) as Activity[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function addActivity(
  userId: string,
  text: string
): Promise<Activity> {
  const entry: Omit<Activity, 'id' | 'user_id'> = {
    text,
    created_at: new Date().toISOString(),
  }

  if (isSupabaseConfigured && supabase) {
    const record = { ...entry, user_id: userId }
    const { data, error } = await supabase
      .from('activity')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Activity
  }

  const existing: Activity[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newEntry: Activity = {
    ...entry,
    id: crypto.randomUUID(),
    user_id: userId,
  }
  existing.unshift(newEntry)
  if (existing.length > 20) existing.pop()
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newEntry
}
