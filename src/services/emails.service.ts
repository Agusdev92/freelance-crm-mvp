import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Email } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_emails_${userId}`
}

export async function fetchEmails(userId: string): Promise<Email[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Email[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function insertEmail(
  userId: string,
  email: Omit<Email, 'id' | 'user_id' | 'created_at'>
): Promise<Email> {
  if (isSupabaseConfigured && supabase) {
    const record = {
      ...email,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('emails')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Email
  }

  const existing: Email[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newEmail: Email = {
    ...email,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }
  existing.unshift(newEmail)
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newEmail
}

export async function updateEmail(
  userId: string,
  id: string,
  updates: Partial<Omit<Email, 'id' | 'user_id' | 'created_at'>>
): Promise<Email> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('emails')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Email
  }

  const existing: Email[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const idx = existing.findIndex(e => e.id === id)
  if (idx === -1) throw new Error('Email not found')
  const updated = { ...existing[idx], ...updates } as Email
  existing[idx] = updated
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return updated
}

export async function deleteEmail(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('emails').delete().eq('id', id)
    if (error) throw error
    return
  }

  const existing: Email[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  localStorage.setItem(
    lsKey(userId),
    JSON.stringify(existing.filter(e => e.id !== id))
  )
}
