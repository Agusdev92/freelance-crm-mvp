import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-5">
          <div className="bg-surface-50 border border-slate-700/50 rounded-2xl w-full max-w-md p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h1 className="text-xl font-bold mb-2">Algo salió mal</h1>
            <p className="text-slate-400 text-sm mb-6">
              La aplicación encontró un error inesperado. Podés recargar la página para intentar de nuevo.
            </p>
            {this.state.error && (
              <pre className="text-xs text-red-400/80 bg-surface-200 rounded-xl p-4 mb-6 text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <Button onClick={() => window.location.reload()}>Recargar página</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
