import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: number
  className?: string
}

export function Spinner({ size = 20, className }: SpinnerProps) {
  return <Loader2 size={size} className={cn('animate-spin text-indigo-400', className)} />
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}

export function LoadingSection({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner size={24} />
      <span className="text-slate-500 text-sm">{message}</span>
    </div>
  )
}
