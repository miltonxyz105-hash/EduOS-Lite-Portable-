import React from 'react'
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Shield } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el próximo render muestre el fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log estructurado para depuración. En producción podría enviar a un servicio externo.
    this.setState({ errorInfo })
    try {
      // eslint-disable-next-line no-console
      console.error('[EduOS ErrorBoundary] Error capturado:', error, errorInfo)
    } catch (_) {
      // ignore
    }
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }))
  }

  handleReload = () => {
    if (typeof window !== 'undefined' && typeof window.location?.reload === 'function') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state
      const stackLine = error?.stack ? error.stack.split('\n')[0] : String(error)
      return (
        <div className="w-full h-full bg-slate-950 text-slate-100 flex items-center justify-center p-6 overflow-auto">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header branding */}
            <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
                <Shield size={22} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  EduOS Lite · Error inesperado
                </div>
                <div className="text-[10px] text-slate-500">
                  Government & Educational Edition
                </div>
              </div>
            </div>

            {/* Cuerpo */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex-shrink-0 mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    El sistema recuperará automáticamente. Si el error persiste,
                    reinicia la aplicación o contacta al administrador de TIC.
                    No se perderán tus datos.
                  </p>
                </div>
              </div>

              {/* Stack resumen */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 font-mono text-[10px] text-amber-400/90 break-words max-h-16 overflow-auto">
                {stackLine || '(sin información disponible)'}
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 active:from-blue-800 active:to-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow shadow-blue-500/20"
                >
                  <RefreshCw size={14} />
                  Reiniciar aplicación
                </button>
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="w-full py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showDetails ? 'Ocultar detalles técnicos' : 'Mostrar detalles técnicos'}
                </button>
              </div>

              {/* Detalles colapsables */}
              {showDetails && (
                <details
                  open
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 flex flex-col gap-2 max-h-64 overflow-auto"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                      Stack trace
                    </div>
                    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap break-words leading-relaxed">
                      {error?.stack || String(error)}
                    </pre>
                  </div>
                  {errorInfo && (
                    <div className="pt-2 border-t border-slate-800/70">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                        Component stack
                      </div>
                      <pre className="text-[10px] text-slate-400 whitespace-pre-wrap break-words leading-relaxed">
                        {errorInfo.componentStack || '(no disponible)'}
                      </pre>
                    </div>
                  )}
                </details>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                EduOS Lite · GovEdu v2.0
              </span>
              <span className="font-mono">
                CODE: UI-001
              </span>
            </div>
          </div>
        </div>
      )
    }

    // Sin error: renderiza los hijos normalmente.
    return this.props.children
  }
}
