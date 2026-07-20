import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-slate-400">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full px-3.5 py-2.5 bg-surface-200 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-indigo-500 resize-none',
          className
        )}
        {...props}
      />
    </div>
  )
}
