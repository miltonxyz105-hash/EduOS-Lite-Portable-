import { useState, useEffect } from 'react'
import {
  Menu,
  Folder,
  Settings,
  Gamepad2,
  Cpu,
  MemoryStick,
  Clock,
  Power,
  ChevronRight,
  X,
  Minus,
  Square,
} from 'lucide-react'

export default function Taskbar({
  openWindows,
  onOpenWindow,
  onToggleWindow,
  onCloseWindow,
  onFocusWindow,
}) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [cpuUsage, setCpuUsage] = useState(24)
  const [ramUsage, setRamUsage] = useState(41)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 11) - 5
        return Math.max(10, Math.min(85, prev + change))
      })
      setRamUsage((prev) => {
        const change = Math.floor(Math.random() * 7) - 3
        return Math.max(25, Math.min(75, prev + change))
      })
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const startItems = [
    { id: 'files', name: 'Explorador de Archivos', icon: Folder, color: 'text-red-500' },
    { id: 'settings', name: 'Configuración', icon: Settings, color: 'text-red-400' },
    { id: 'games', name: 'Lanzador de Juegos', icon: Gamepad2, color: 'text-red-500' },
    { id: 'settings', name: 'Rendimiento', icon: Cpu, color: 'text-red-400' },
  ]

  return (
    <>
      {showStartMenu && (
        <div className="fixed bottom-14 left-2 z-40 w-72 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center">
                <Power size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Usuario Gamer</p>
                <p className="text-gray-500 text-xs">HyperX OS v1.0</p>
              </div>
            </div>
          </div>

          <div className="p-3">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 px-2">
              Accesos Rápidos
            </p>
            <div className="grid grid-cols-2 gap-1">
              {startItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onOpenWindow(item.id)
                      setShowStartMenu(false)
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-black transition-colors text-left"
                  >
                    <div className={`w-9 h-9 rounded-lg bg-black flex items-center justify-center ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <span className="text-white text-sm">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-3 border-t border-gray-800 bg-black/30">
            <div className="grid grid-cols-2 gap-1">
              <div className="space-y-1">
                <p className="text-gray-500 text-xs uppercase tracking-wider px-2">Sistema</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/60">
                  <span className="text-gray-400 text-xs">Versión</span>
                  <span className="text-red-500 text-xs font-semibold">1.0 B/R</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-xs uppercase tracking-wider px-2">Estado</p>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/60">
                  <span className="text-gray-400 text-xs">Boot</span>
                  <span className="text-red-500 text-xs font-semibold">Rápido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 h-12 bg-black/90 backdrop-blur-xl border-t border-gray-800 flex items-center px-2 gap-1">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all ${
            showStartMenu
              ? 'bg-red-500/20 border border-red-500/50 text-red-500'
              : 'hover:bg-gray-900 text-white'
          }`}
        >
          <Menu size={18} />
          <span className="text-sm font-semibold hidden sm:inline">Inicio</span>
        </button>

        <div className="w-px h-6 bg-gray-800 mx-1"></div>

        <button
          onClick={() => onOpenWindow('files')}
          className="h-10 px-3 rounded-lg hover:bg-gray-900 flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Folder size={18} />
          <span className="text-sm hidden sm:inline">Archivos</span>
        </button>

        <button
          onClick={() => onOpenWindow('settings')}
          className="h-10 px-3 rounded-lg hover:bg-gray-900 flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
        >
          <Settings size={18} />
          <span className="text-sm hidden sm:inline">Configuración</span>
        </button>

        <div className="w-px h-6 bg-gray-800 mx-1"></div>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {openWindows.map((win) => {
            const Icon = win.icon
            return (
              <button
                key={win.id}
                onClick={() =>
                  win.isMinimized ? onToggleWindow(win.id) : onFocusWindow(win.id)
                }
                className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap border ${
                  win.isMinimized
                    ? 'bg-gray-900/60 border-gray-800 text-gray-500 hover:bg-gray-900'
                    : 'bg-gray-900 border-red-500/30 text-white shadow-neon-red'
                }`}
              >
                <Icon size={16} className={win.color} />
                <span className="text-xs font-medium max-w-24 truncate">{win.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleWindow(win.id)
                  }}
                  className="p-0.5 hover:bg-gray-700 rounded"
                >
                  {win.isMinimized ? <Square size={10} /> : <Minus size={10} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseWindow(win.id)
                  }}
                  className="p-0.5 hover:bg-red-500/80 rounded"
                >
                  <X size={10} />
                </button>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <div className="hidden md:flex items-center gap-3 bg-gray-900/60 rounded-lg px-3 py-1.5 border border-gray-800">
            <div className="flex items-center gap-1.5">
              <Cpu size={14} className={cpuUsage > 70 ? 'text-red-500' : 'text-red-500'} />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 leading-none">CPU</span>
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      cpuUsage > 70 ? 'bg-red-700' : 'bg-red-500'
                    }`}
                    style={{ width: `${cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-bold ml-0.5 text-red-500">{cpuUsage}%</span>
            </div>

            <div className="w-px h-5 bg-gray-800"></div>

            <div className="flex items-center gap-1.5">
              <MemoryStick size={14} className="text-red-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 leading-none">RAM</span>
                <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full transition-all duration-500 bg-red-500"
                    style={{ width: `${ramUsage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs font-bold ml-0.5 text-red-400">{ramUsage}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-1.5 border border-gray-800">
            <Clock size={14} className="text-red-500" />
            <div className="flex flex-col items-end leading-tight">
              <span className="text-white text-sm font-semibold">
                {time.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
              <span className="text-gray-500 text-[10px]">
                {time.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <ChevronRight size={12} className="text-gray-600" />
          </div>
        </div>
      </div>
    </>
  )
}
