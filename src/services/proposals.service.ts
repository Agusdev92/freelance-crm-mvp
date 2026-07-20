import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Proposal, ProposalInput } from '@/lib/types'

function lsKey(userId: string) {
  return `freelanceai_proposals_${userId}`
}

export async function fetchProposals(userId: string): Promise<Proposal[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as Proposal[]
  }

  return JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
}

export async function insertProposal(
  userId: string,
  proposal: Omit<Proposal, 'id' | 'user_id' | 'created_at'>
): Promise<Proposal> {
  if (isSupabaseConfigured && supabase) {
    const record = {
      ...proposal,
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
      .from('proposals')
      .insert(record)
      .select()
      .single()
    if (error) throw error
    return data as Proposal
  }

  const existing: Proposal[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  const newProposal: Proposal = {
    ...proposal,
    id: crypto.randomUUID(),
    user_id: userId,
    created_at: new Date().toISOString(),
  }
  existing.unshift(newProposal)
  localStorage.setItem(lsKey(userId), JSON.stringify(existing))
  return newProposal
}

export async function deleteProposal(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('proposals').delete().eq('id', id)
    if (error) throw error
    return
  }

  const existing: Proposal[] = JSON.parse(localStorage.getItem(lsKey(userId)) || '[]')
  localStorage.setItem(
    lsKey(userId),
    JSON.stringify(existing.filter(p => p.id !== id))
  )
}

const TYPE_LABELS: Record<string, string> = {
  web: 'Desarrollo Web',
  design: 'Diseño',
  consulting: 'Consultoría',
  marketing: 'Marketing',
  other: 'Servicio',
}

export async function generateProposal(input: ProposalInput): Promise<string> {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!openaiKey) {
    return generateFallbackProposal(input)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Eres un experto en crear propuestas comerciales para freelancers. Genera propuestas profesionales, detalladas y persuasivas en español. Incluye secciones: resumen ejecutivo, objetivos, alcance, metodología, cronograma, inversión, por qué elegirnos, próximos pasos.',
          },
          {
            role: 'user',
            content: `Crea una propuesta comercial con estos datos:
- Proyecto: ${input.project}
- Cliente: ${input.client || 'No especificado'}
- Tipo de servicio: ${TYPE_LABELS[input.type] || input.type}
- Presupuesto: ${input.budget ? '$' + input.budget : 'No especificado'}
- Duración: ${input.duration || 'No especificada'}
- Descripción: ${input.description || 'No proporcionada'}`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    const result = await response.json()
    return result.choices[0].message.content
  } catch {
    return generateFallbackProposal(input)
  }
}

function generateFallbackProposal(input: ProposalInput): string {
  const label = TYPE_LABELS[input.type] || input.type
  const sections = [
    `PROPUESTA COMERCIAL`,
    `${input.project}`,
    `${'─'.repeat(40)}`,
    '',
    input.client ? `Cliente: ${input.client}` : '',
    `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    '',
    `1. RESUMEN EJECUTIVO`,
    '',
    `Presentamos esta propuesta para el desarrollo de "${input.project}", diseñada para satisfacer las necesidades específicas de ${input.client || 'su empresa'}. Nuestro enfoque combina excelencia técnica con una comprensión profunda de los objetivos de negocio.`,
    '',
    `2. OBJETIVOS`,
    '',
    `• Comprender las necesidades específicas del proyecto`,
    `• Entregar soluciones de alta calidad en ${label}`,
    `• Superar las expectativas del cliente`,
    `• Establecer una relación a largo plazo`,
    '',
    `3. ALCANCE DEL PROYECTO`,
    '',
    input.description || 'El proyecto incluye todas las fases necesarias para la entrega exitosa.',
    '',
    `4. METODOLOGÍA`,
    '',
    `Trabajamos con metodología ágil para garantizar transparencia y flexibilidad:`,
    `• Sprint 1: Investigación y planificación`,
    `• Sprint 2: Desarrollo inicial`,
    `• Sprint 3: Implementación principal`,
    `• Sprint 4: Testing y optimización`,
    `• Sprint 5: Lanzamiento y capacitación`,
    '',
    `5. INVERSIÓN`,
    '',
    input.budget
      ? `Inversión total: $${input.budget.toLocaleString()}\n\nOpciones de pago:\n• 50% anticipo, 50% contra entrega\n• 3 cuotas sin interés`
      : 'El presupuesto será definido tras una evaluación detallada de los requerimientos.',
    '',
    `6. PRÓXIMOS PASOS`,
    '',
    `1. Aceptación de esta propuesta`,
    `2. Reunión de kickoff`,
    `3. Firma de contrato`,
    `4. Inicio del proyecto`,
    '',
    `${'─'.repeat(40)}`,
    `Esperamos tener la oportunidad de trabajar juntos.`,
  ]

  return sections.filter(Boolean).join('\n')
}
