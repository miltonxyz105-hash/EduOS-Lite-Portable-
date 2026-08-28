import { Folder, Settings, Gamepad2, Trash2 } from 'lucide-react'

const desktopIcons = [
  { id: 'files', name: 'Explorador de Archivos', icon: Folder, color: 'text-red-500' },
  { id: 'settings', name: 'Configuración', icon: Settings, color: 'text-red-400' },
  { id: 'games', name: 'Lanzador de Juegos', icon: Gamepad2, color: 'text-red-500' },
  { id: 'trash', name: 'Papelera de Reciclaje', icon: Trash2, color: 'text-gray-400' },
]

export default function Desktop({ onOpenWindow }) {
  return (
    <div className="absolute inset-0 pb-14 overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-red-700 blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-red-900 blur-[120px] translate-x-1/3 translate-y-1/3"></div>
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        ></div>
      </div>

      <div className="relative z-10 p-6 grid grid-cols-1 gap-2 w-48">
        {desktopIcons.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onOpenWindow(item.id)}
              onDoubleClick={() => onOpenWindow(item.id)}
              className="group flex flex-col items-center justify-center p-3 rounded-lg hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/30 w-36 cursor-pointer"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform ${item.color} shadow-lg`}
              >
                <Icon size={28} />
              </div>
              <span className="text-white text-xs text-center leading-tight drop-shadow-lg">
                {item.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-16 right-6 z-10">
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 w-56">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              HyperX OS
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Estado del sistema</span>
              <span className="text-red-500 font-semibold">Optimizado</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Modo</span>
              <span className="text-red-500 font-semibold">Gaming</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Edición</span>
              <span className="text-red-500 font-semibold">Black & Red</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}