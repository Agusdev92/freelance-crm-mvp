import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-slate-400">{label}</label>
      )}
      <input
        className={cn(
          'w-full px-3.5 py-2.5 bg-surface-200 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-indigo-500',
          className
        )}
        {...props}
      />
    </div>
  )
}
