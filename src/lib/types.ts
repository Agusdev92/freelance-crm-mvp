// Database Types - Generated from Supabase schema
export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  company: string | null
  created_at: string
}

export interface Contact {
  id: string
  user_id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  tags: string[]
  notes: string | null
  created_at: string
}

export type DealStage = 'lead' | 'proposal' | 'negotiation' | 'closed'

export interface Deal {
  id: string
  user_id: string
  name: string
  contact_id: string | null
  value: number
  stage: DealStage
  notes: string | null
  created_at: string
}

export interface Proposal {
  id: string
  user_id: string
  project: string
  client: string | null
  type: string | null
  budget: number | null
  duration: string | null
  description: string | null
  content: string | null
  date: string | null
  created_at: string
}

export interface Email {
  id: string
  user_id: string
  contact_id: string | null
  subject: string
  body: string | null
  sent_at: string | null
  opened: boolean
  opened_at: string | null
  created_at: string
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: string
  user_id: string
  contact_id: string | null
  number: string | null
  concept: string
  amount: number
  due_date: string | null
  status: InvoiceStatus
  notes: string | null
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  text: string
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
}

export interface ProposalInput {
  project: string
  client?: string
  type: string
  budget?: number
  duration?: string
  description?: string
}

export interface DashboardStats {
  totalContacts: number
  activeDeals: number
  pipelineTotal: number
  totalProposals: number
  totalInvoiced: number
  totalPending: number
  totalPaid: number
  totalInvoices: number
}
