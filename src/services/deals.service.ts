import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Deal } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_deals_${userId}`
}

export async function fetchDeals(userId: string): Promise<Deal[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Deal[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function insertDeal(
  userId: string,
  deal: Omit<Deal, 'id' | 'user_id' | 'created_at'>
): Promise<Deal> {
  if (isSupabaseConfigured && supabase) {
    const record = {
      ...deal,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('deals')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Deal
  }

  const existing: Deal[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newDeal: Deal = {
    ...deal,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }
  existing.unshift(newDeal)
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newDeal
}

export async function updateDeal(
  userId: string,
  id: string,
  updates: Partial<Omit<Deal, 'id' | 'user_id' | 'created_at'>>
): Promise<Deal> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('deals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Deal
  }

  const existing: Deal[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const idx = existing.findIndex(d => d.id === id)
  if (idx === -1) throw new Error('Deal not found')
  const updated = { ...existing[idx], ...updates } as Deal
  existing[idx] = updated
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return updated
}

export async function deleteDeal(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('deals').delete().eq('id', id)
    if (error) throw error
    return
  }

  const existing: Deal[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  localStorage.setItem(
    lsKey(userId),
    JSON.stringify(existing.filter(d => d.id !== id))
  )
}
