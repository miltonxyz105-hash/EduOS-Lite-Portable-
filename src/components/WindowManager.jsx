export default function WindowManager({ window: windowData, onClose, onMinimize, onFocus, zIndex }) {
  if (!windowData || windowData.isMinimized) return null

  const ContentComponent = windowData.Component
  const Icon = windowData.icon

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
      className="absolute bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-800 flex flex-col overflow-hidden select-none"
    >
      {/* Barra de título de la ventana */}
      <div className="bg-gray-950 px-4 py-2 flex items-center justify-between cursor-move border-b border-gray-800">
        <div className="flex items-center space-x-2">
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