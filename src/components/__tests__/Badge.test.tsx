import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>标签</Badge>)
    expect(screen.getByText('标签')).toBeInTheDocument()
  })

  it('applies default variant class', () => {
    render(<Badge>Tag</Badge>)
    expect(screen.getByText('Tag').className).toContain('bg-indigo-500')
  })

  it('applies success variant class', () => {
    render(<Badge variant="success">OK</Badge>)
    expect(screen.getByText('OK').className).toContain('bg-emerald-500')
  })
})
