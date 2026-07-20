import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, formatDateTime, cn, getInitials } from '../utils'

describe('formatCurrency', () => {
  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0')
  })

  it('formats positive values', () => {
    const result = formatCurrency(1000)
    expect(result).toMatch(/^\$[\d.,]+$/)
    expect(result).toContain('1')
  })

  it('formats negative values', () => {
    expect(formatCurrency(-500)).toBe('$-500')
  })
})

describe('formatDate', () => {
  it('formats ISO date string', () => {
    const result = formatDate('2026-03-15T10:30:00Z')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})

describe('formatDateTime', () => {
  it('formats ISO datetime string', () => {
    const result = formatDateTime('2026-03-15T10:30:00Z')
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })
})

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('filters falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('returns empty string for no args', () => {
    expect(cn()).toBe('')
  })
})

describe('getInitials', () => {
  it('returns first two initials from name', () => {
    expect(getInitials('Juan Perez')).toBe('JP')
  })

  it('returns single initial for single name', () => {
    expect(getInitials('Juan')).toBe('J')
  })

  it('caps at 2 characters', () => {
    expect(getInitials('Juan Carlos Perez')).toBe('JC')
  })

  it('handles lowercase names', () => {
    expect(getInitials('maria lopez')).toBe('ML')
  })
})
