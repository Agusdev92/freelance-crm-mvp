import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <p>Content</p>
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Hidden">
        <p>Content</p>
      </Modal>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('calls onClose when clicking overlay', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} title="Modal">
        <p>Content</p>
      </Modal>
    )
    const overlay = document.querySelector('.fixed.inset-0')!
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when pressing Escape', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} title="Modal">
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} title="Modal">
        <p>Inner content</p>
      </Modal>
    )
    fireEvent.click(screen.getByText('Inner content'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
