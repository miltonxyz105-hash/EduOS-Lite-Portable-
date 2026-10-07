import { useEffect, useRef, useState } from 'react'

export default function WindowManager({
  window: windowData,
  onClose,
  onMinimize,
  onFocus,
  onDrag,
  zIndex,
}) {
  if (!windowData) return null
  if (windowData.isMinimized) return null

  const ContentComponent = windowData.Component
  const Icon = windowData.icon
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 })
  const containerRef = useRef(null)
  const titleBarRef = useRef(null)

  useEffect(() => {
    if (!isDragging) return undefined

    const handleMove = (e) => {
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      const newX = Math.max(0, dragState.current.origX + dx)
      let newY = Math.max(0, dragState.current.origY + dy)

      if (typeof document !== 'undefined' && document.documentElement?.clientHeight) {
        const maxY = Math.max(0, document.documentElement.clientHeight - 64)
        newY = Math.min(newY, maxY)
      }
      if (typeof onDrag === 'function') {
        onDrag(windowData.id, { x: newX, y: newY })
      }
    }
    const handleUp = () => setIsDragging(false)
    const handleSelectStart = (ev) => ev.preventDefault()

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('selectstart', handleSelectStart)
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('selectstart', handleSelectStart)
      document.body.style.userSelect = ''
    }
  }, [isDragging, windowData?.id, onDrag])

  const startDrag = (e) => {
    if (!e || e.button !== 0) return
    e.stopPropagation()
    e.preventDefault()
    const pos = windowData?.position || { x: 0, y: 0 }
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x || 0,
      origY: pos.y || 0,
    }
    setIsDragging(true)
    if (typeof onFocus === 'function') onFocus(windowData.id)
  }

  const handleContainerMouseDown = (e) => {
    if (e.target && titleBarRef.current && titleBarRef.current.contains(e.target)) return
    if (typeof onFocus === 'function') onFocus(windowData.id)
  }

  const width = Number.isFinite(windowData?.size?.width) ? windowData.size.width : 720
  const height = Number.isFinite(windowData?.size?.height) ? windowData.size.height : 540
  const left = Number.isFinite(windowData?.position?.x) ? windowData.position.x : 0
  const top = Number.isFinite(windowData?.position?.y) ? windowData.position.y : 0
  const iconColor = typeof windowData?.color === 'string' ? windowData.color : 'text-blue-500'

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      style={{ zIndex, top, left, width, height }}
      className={
        'absolute bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-800 flex flex-col overflow-hidden select-none ' +
        (isDragging ? 'cursor-grabbing shadow-blue-500/30' : '')
      }
    >
      {/* Barra de título de la ventana (drag handle) */}
      <div
        ref={titleBarRef}
        onMouseDown={startDrag}
        onDoubleClick={(e) => e.stopPropagation()}
        className={
          'bg-gray-950 px-4 py-2 flex items-center justify-between ' +
          (isDragging
            ? 'cursor-grabbing bg-blue-500/10'
            : 'cursor-move hover:bg-gray-900/70') +
          ' border-b border-gray-800 select-none'
        }
      >
        <div className="flex items-center space-x-2 pointer-events-none">
          {Icon && <Icon className={'w-4 h-4 flex-shrink-0 ' + iconColor} />}
          <span className="text-xs font-semibold text-gray-200 truncate">
            {windowData?.title || ''}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (typeof onMinimize === 'function') onMinimize(windowData.id)
            }}
            className="hover:bg-gray-800 text-gray-400 hover:text-white px-2 py-0.5 rounded text-xs transition-colors"
            aria-label="Minimizar ventana"
          >
            _
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (typeof onClose === 'function') onClose(windowData.id)
            }}
            className="hover:bg-red-600 text-gray-400 hover:text-white px-2 py-0.5 rounded text-xs transition-colors"
            aria-label="Cerrar ventana"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido interior de la ventana */}
      <div className="flex-1 overflow-auto bg-gray-900">
        {ContentComponent ? <ContentComponent /> : windowData?.content || null}
      </div>
    </div>
  )
}

