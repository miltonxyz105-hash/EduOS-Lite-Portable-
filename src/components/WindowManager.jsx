import { useEffect, useRef, useState } from 'react'

export default function WindowManager({ window: windowData, onClose, onMinimize, onFocus, onDrag, zIndex }) {
  if (!windowData || windowData.isMinimized) return null

  const ContentComponent = windowData.Component
  const Icon = windowData.icon
  const titleRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 })

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (e) => {
      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY
      const newX = Math.max(0, dragState.current.origX + dx)
      const newY = Math.max(0, dragState.current.origY + dy)
      if (onDrag) onDrag(windowData.id, { x: newX, y: newY })
    }
    const handleUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging, windowData.id, onDrag])

  const startDrag = (e) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const pos = windowData.position
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    }
    setIsDragging(true)
  }

  return (
    <div
      onClick={() => onFocus(windowData.id)}
      style={{
        zIndex,
        top: windowData.position.y,
        left: windowData.position.x,
        width: windowData.size.width,
        height: windowData.size.height,
      }}
      className={`absolute bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-800 flex flex-col overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
    >
      {/* Barra de título de la ventana (drag handle) */}
      <div
        ref={titleRef}
        onMouseDown={startDrag}
        className={`bg-gray-950 px-4 py-2 flex items-center justify-between ${
          isDragging ? 'cursor-grabbing' : 'cursor-move'
        } border-b border-gray-800 select-none`}
      >
        <div className="flex items-center space-x-2 pointer-events-none">
          {Icon && <Icon className={`w-4 h-4 ${windowData.color}`} />}
          <span className="text-xs font-semibold text-gray-200">{windowData.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMinimize(windowData.id)
            }}
            className="hover:bg-gray-800 text-gray-400 hover:text-white px-2 py-0.5 rounded text-xs transition-colors"
          >
            _
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClose(windowData.id)
            }}
            className="hover:bg-red-600 text-gray-400 hover:text-white px-2 py-0.5 rounded text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Contenido interior de la ventana */}
      <div className="flex-1 overflow-auto bg-gray-900">
        {ContentComponent ? <ContentComponent /> : windowData.content}
      </div>
    </div>
  )
}
