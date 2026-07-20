import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Invoice } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_invoices_${userId}`
}

export async function fetchInvoices(userId: string): Promise<Invoice[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Invoice[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function insertInvoice(
  userId: string,
  invoice: Omit<Invoice, 'id' | 'user_id' | 'created_at'>
): Promise<Invoice> {
  if (isSupabaseConfigured && supabase) {
    const record = {
      ...invoice,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('invoices')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Invoice
  }

  const existing: Invoice[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newInvoice: Invoice = {
    ...invoice,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }
  existing.unshift(newInvoice)
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newInvoice
}

export async function updateInvoice(
  userId: string,
  id: string,
  updates: Partial<Omit<Invoice, 'id' | 'user_id' | 'created_at'>>
): Promise<Invoice> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Invoice
  }

  const existing: Invoice[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const idx = existing.findIndex(i => i.id === id)
  if (idx === -1) throw new Error('Invoice not found')
  const updated = { ...existing[idx], ...updates } as Invoice
  existing[idx] = updated
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return updated
}

export async function deleteInvoice(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) throw error
    return
  }

  const existing: Invoice[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  localStorage.setItem(
    lsKey(userId),
    JSON.stringify(existing.filter(i => i.id !== id))
  )
}
