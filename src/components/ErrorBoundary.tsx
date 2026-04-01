import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
          <div className="bg-destructive/10 p-6 rounded-xl max-w-md w-full border border-destructive/20">
            <h2 className="text-xl font-bold text-destructive mb-2">Ops! Algo deu errado.</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Encontramos um problema ao tentar carregar esta tela. Nossa equipe já foi notificada.
            </p>
            <p className="bg-background/50 p-3 rounded text-xs font-mono text-left overflow-auto mb-6 text-foreground/80">
              {this.state.error?.message || 'Erro desconhecido'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.href = '/'
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full font-medium"
            >
              Recarregar aplicação
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
