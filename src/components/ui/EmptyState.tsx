import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
      {icon && <div className="mb-3 text-slate-600">{icon}</div>}
      <p>{message}</p>
    </div>
  )
}
