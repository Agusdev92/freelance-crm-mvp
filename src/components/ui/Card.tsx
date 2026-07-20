import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface-50 border border-slate-700/50 rounded-2xl ${className}`}>
      {children}
    </div>
  )
}
