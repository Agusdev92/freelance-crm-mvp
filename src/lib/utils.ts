export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-ES')}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES')
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-ES')
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
