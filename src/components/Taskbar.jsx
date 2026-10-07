import { useState, useEffect, useRef } from 'react'
import {
  Menu,
  Folder,
  Settings,
  Cpu,
  MemoryStick,
  Clock,
  Shield,
  X,
  Minus,
  Square,
  BookOpen,
  Zap,
  Usb,
  Activity,
  Search,
  Trash2,
  ChevronRight,
} from 'lucide-react'

export default function Taskbar({
  openWindows,
  onOpenWindow,
  onToggleWindow,
  onCloseWindow,
  onFocusWindow,
  studyModeActive,
  setStudyModeActive,
  batteryModeActive,
  setBatteryModeActive,
}) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [cpuUsage, setCpuUsage] = useState(18)
  const [ramUsage, setRamUsage] = useState(35)
  const [time, setTime] = useState(new Date())
  const startMenuCloseRef = useRef(null)

  useEffect(() => {
    if (!showStartMenu) return undefined
    const handleClickOutside = (ev) => {
      if (startMenuCloseRef.current && !startMenuCloseRef.current.contains(ev.target)) {
        setShowStartMenu(false)
      }
    }
    const handleEsc = (ev) => {
      if (ev.key === 'Escape') setShowStartMenu(false)
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [showStartMenu])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
      setCpuUsage((prev) => {
        const change = Math.floor(Math.random() * 9) - 4
        const maxCpu = batteryModeActive ? 55 : 80
        return Math.max(5, Math.min(maxCpu, prev + change))
      })
      setRamUsage((prev) => {
        const change = Math.floor(Math.random() * 5) - 2
        const maxRam = batteryModeActive ? 55 : 75
        return Math.max(18, Math.min(maxRam, prev + change))
      })
    }, 2500)
    return () => clearInterval(timer)
  }, [batteryModeActive])

  const startItems = [
    { id: 'launcher', name: 'Lanzador Apps', icon: Search, color: 'text-blue-400' },
    { id: 'files', name: 'Archivos', icon: Folder, color: 'text-blue-500' },
    { id: 'cleaner', name: 'Limpiar RAM', icon: Activity, color: 'text-green-500' },
    { id: 'processes', name: 'Procesos', icon: Cpu, color: 'text-blue-500' },
    { id: 'study', name: 'Modo Estudio', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'usbsync', name: 'Respaldo USB', icon: Usb, color: 'text-cyan-500' },
    { id: 'settings', name: 'Configuración', icon: Settings, color: 'text-blue-400' },
    { id: 'trash', name: 'Papelera', icon: Trash2, color: 'text-gray-400' },
  ]

  return (
    <>
      {showStartMenu && (
        <div className="fixed bottom-12 left-2 z-40 w-72 bg-slate-900/95 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Estudiante</p>
                <p className="text-slate-500 text-[11px]">EduOS Lite v2.0</p>
              </div>
            </div>
          </div>

          <div className="p-2.5">
            <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-2 px-2">
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
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-950 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center ${item.color}`}>
                      <Icon size={16} />
                    </div>
                    <span className="text-white text-[12px]">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-2.5 border-t border-slate-800 bg-slate-950/40">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setStudyModeActive(!studyModeActive)
                  setShowStartMenu(false)
                }}
                className={`px-2.5 py-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5 justify-center ${
                  studyModeActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <BookOpen size={13} />
                {studyModeActive ? 'Estudio ON' : 'Estudio OFF'}
              </button>
              <button
                onClick={() => {
                  setBatteryModeActive(!batteryModeActive)
                  setShowStartMenu(false)
                }}
                className={`px-2.5 py-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5 justify-center ${
                  batteryModeActive
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Zap size={13} />
                {batteryModeActive ? 'Batería ON' : 'Batería OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 h-11 bg-slate-950/90 border-t border-slate-800 flex items-center px-2 gap-1">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className={`h-9 px-2.5 rounded-lg flex items-center gap-2 transition-colors ${
            showStartMenu
              ? 'bg-blue-500/20 border border-blue-500/40 text-blue-400'
              : 'hover:bg-slate-800 text-white'
          }`}
        >
          <Menu size={16} />
          <span className="text-xs font-semibold hidden sm:inline">Inicio</span>
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <button
          onClick={() => onOpenWindow('files')}
          className="h-9 px-2.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-blue-500 transition-colors"
        >
          <Folder size={16} />
          <span className="text-xs hidden sm:inline">Archivos</span>
        </button>

        <button
          onClick={() => onOpenWindow('launcher')}
          className="h-9 px-2.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors"
        >
          <Search size={16} />
          <span className="text-xs hidden sm:inline">Apps</span>
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1"></div>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {openWindows.map((win) => {
            const Icon = win.icon
            return (
              <button
                key={win.id}
                onClick={() =>
                  win.isMinimized ? onToggleWindow(win.id) : onFocusWindow(win.id)
                }
                className={`h-9 px-2.5 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap border ${
                  win.isMinimized
                    ? 'bg-slate-800/50 border-slate-800 text-slate-500 hover:bg-slate-800'
                    : 'bg-slate-800 border-blue-500/20 text-white'
                }`}
              >
                <Icon size={14} className={win.color} />
                <span className="text-[11px] font-medium max-w-20 truncate">{win.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleWindow(win.id)
                  }}
                  className="p-0.5 hover:bg-slate-700 rounded"
                >
                  {win.isMinimized ? <Square size={9} /> : <Minus size={9} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseWindow(win.id)
                  }}
                  className="p-0.5 hover:bg-red-500/70 rounded"
                >
                  <X size={9} />
                </button>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-1.5 ml-1">
          {studyModeActive && (
            <div className="hidden sm:flex items-center gap-1 bg-emerald-500/15 rounded-md px-2 py-1 border border-emerald-500/25">
              <BookOpen size={11} className="text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">ESTUDIO</span>
            </div>
          )}
          {batteryModeActive && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-500/15 rounded-md px-2 py-1 border border-amber-500/25">
              <Zap size={11} className="text-amber-400" />
              <span className="text-[10px] font-medium text-amber-400">AHORRO</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2.5 bg-slate-800/60 rounded-md px-2.5 py-1 border border-slate-800">
            <div className="flex items-center gap-1">
              <Cpu size={12} className="text-blue-500" />
              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cpuUsage > 65 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${cpuUsage}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-blue-500 w-6">{cpuUsage}%</span>
            </div>
            <div className="flex items-center gap-1">
              <MemoryStick size={12} className="text-green-500" />
              <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${ramUsage > 65 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${ramUsage}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-green-500 w-6">{ramUsage}%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-md px-2.5 py-1 border border-slate-800">
            <Clock size={12} className="text-blue-500" />
            <div className="flex flex-col items-end leading-tight">
              <span className="text-white text-xs font-medium">
                {time.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
              <span className="text-slate-500 text-[9px]">
                {time.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
              </span>
            </div>
            <ChevronRight size={10} className="text-slate-600" />
          </div>
        </div>
      </div>
    </>
  )
}
