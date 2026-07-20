import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ToastProvider, useToast } from '@/contexts/ToastContext'

function TestComponent() {
  const { toasts, addToast, removeToast } = useToast()
  return (
    <div>
      <button onClick={() => addToast('Test message', 'success')}>Add Toast</button>
      <button onClick={() => addToast('Error msg', 'error')}>Add Error</button>
      <div data-testid="count">{toasts.length}</div>
      {toasts.map(t => (
        <div key={t.id} data-testid={`toast-${t.type}`}>
          {t.message}
          <button onClick={() => removeToast(t.id)}>Remove</button>
        </div>
      ))}
    </div>
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Toast system', () => {
  it('adds a toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
    expect(screen.getByTestId('count').textContent).toBe('0')

    act(() => {
      screen.getByText('Add Toast').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('1')
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('removes a toast manually', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Add Toast').click()
    })

    act(() => {
      screen.getByText('Remove').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('0')
  })

  it('auto-removes toast after 4 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Add Toast').click()
    })

    expect(screen.getByTestId('count').textContent).toBe('1')

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.getByTestId('count').textContent).toBe('0')
  })
})
