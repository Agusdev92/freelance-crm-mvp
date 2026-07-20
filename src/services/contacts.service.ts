import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Contact } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_contacts_${userId}`
}

export async function fetchContacts(userId: string): Promise<Contact[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Contact[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function insertContact(
  userId: string,
  contact: Omit<Contact, 'id' | 'user_id' | 'created_at'>
): Promise<Contact> {
  if (isSupabaseConfigured && supabase) {
    const record = {
      ...contact,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('contacts')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Contact
  }

  const existing: Contact[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newContact: Contact = {
    ...contact,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }
  existing.unshift(newContact)
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newContact
}

export async function updateContact(
  userId: string,
  id: string,
  updates: Partial<Omit<Contact, 'id' | 'user_id' | 'created_at'>>
): Promise<Contact> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Contact
  }

  const existing: Contact[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const idx = existing.findIndex(c => c.id === id)
  if (idx === -1) throw new Error('Contact not found')
  const updated = { ...existing[idx], ...updates } as Contact
  existing[idx] = updated
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return updated
}

export async function deleteContact(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('contacts').delete().eq('id', id)
    if (error) throw error
    return
  }

  const existing: Contact[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  localStorage.setItem(
    lsKey(userId),
    JSON.stringify(existing.filter(c => c.id !== id))
  )
}
