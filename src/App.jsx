import { useState, useEffect } from 'react'
import { Folder, Settings, Trash2, BookOpen, Activity, Search, ShieldCheck, Usb } from 'lucide-react'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import WindowManager from './components/WindowManager'
import FileExplorerWindow from './components/FileExplorerWindow'
import SettingsWindow from './components/SettingsWindow'
import TrashWindow from './components/TrashWindow'
import SystemCleanerWindow from './components/SystemCleanerWindow'
import ProcessViewerWindow from './components/ProcessViewerWindow'
import LauncherWindow from './components/LauncherWindow'
import StudyModeWindow from './components/StudyModeWindow'
import USBSyncWindow from './components/USBSyncWindow'

const WINDOW_CONFIGS = {
  files: {
    id: 'files',
    title: 'Explorador de Archivos',
    icon: Folder,
    color: 'text-blue-500',
    Component: FileExplorerWindow,
    position: { x: 120, y: 80 },
    size: { width: 900, height: 560 },
  },
  settings: {
    id: 'settings',
    title: 'Configuración del Sistema',
    icon: Settings,
    color: 'text-blue-400',
    Component: SettingsWindow,
    position: { x: 200, y: 110 },
    size: { width: 720, height: 540 },
  },
  trash: {
    id: 'trash',
    title: 'Papelera de Reciclaje',
    icon: Trash2,
    color: 'text-gray-400',
    Component: TrashWindow,
    position: { x: 220, y: 120 },
    size: { width: 760, height: 480 },
  },
  cleaner: {
    id: 'cleaner',
    title: 'Limpiador de Sistema',
    icon: Activity,
    color: 'text-green-500',
    Component: SystemCleanerWindow,
    position: { x: 180, y: 100 },
    size: { width: 680, height: 520 },
  },
  processes: {
    id: 'processes',
    title: 'Visor de Procesos',
    icon: Activity,
    color: 'text-blue-500',
    Component: ProcessViewerWindow,
    position: { x: 160, y: 90 },
    size: { width: 720, height: 540 },
  },
  launcher: {
    id: 'launcher',
    title: 'Lanzador Universal',
    icon: Search,
    color: 'text-blue-400',
    Component: LauncherWindow,
    position: { x: 240, y: 130 },
    size: { width: 640, height: 480 },
  },
  study: {
    id: 'study',
    title: 'Modo Estudio',
    icon: BookOpen,
    color: 'text-emerald-500',
    Component: StudyModeWindow,
    position: { x: 170, y: 95 },
    size: { width: 680, height: 540 },
  },
  usbsync: {
    id: 'usbsync',
    title: 'Portabilidad USB & Nube',
    icon: Usb,
    color: 'text-cyan-500',
    Component: USBSyncWindow,
    position: { x: 190, y: 105 },
    size: { width: 700, height: 520 },
  },
}

const LOW_RES_BREAKPOINTS = {
  LOW: { width: 1024, height: 600, scale: 0.85 },
  MED: { width: 1366, height: 768, scale: 0.92 },
  HIGH: { width: 1920, height: 1080, scale: 1.0 },
}

function App() {
  const [isLocked, setIsLocked] = useState(true)
  const [windows, setWindows] = useState([])
  const [zOrder, setZOrder] = useState([])
  const [uiScale, setUiScale] = useState(1.0)
  const [studyModeActive, setStudyModeActive] = useState(false)
  const [batteryModeActive, setBatteryModeActive] = useState(false)

  useEffect(() => {
    const applyDynamicScaling = () => {
      const w = window.innerWidth
      if (w <= LOW_RES_BREAKPOINTS.LOW.width) {
        setUiScale(LOW_RES_BREAKPOINTS.LOW.scale)
      } else if (w <= LOW_RES_BREAKPOINTS.MED.width) {
        setUiScale(LOW_RES_BREAKPOINTS.MED.scale)
      } else {
        setUiScale(LOW_RES_BREAKPOINTS.HIGH.scale)
      }
    }
    applyDynamicScaling()
    window.addEventListener('resize', applyDynamicScaling)
    return () => window.removeEventListener('resize', applyDynamicScaling)
  }, [])

  const handleUnlock = () => setIsLocked(false)

  const getZIndex = (id) => {
    const idx = zOrder.indexOf(id)
    return idx === -1 ? 100 : 100 + idx + 1
  }

  const openWindow = (id) => {
    if (!(id in WINDOW_CONFIGS)) return
    const existing = windows.find((w) => w.id === id)
    if (existing) {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
      )
      setZOrder((prev) => [...prev.filter((z) => z !== id), id])
      return
    }
    const config = WINDOW_CONFIGS[id]
    const offset = windows.length * 24
    const newWindow = {
      ...config,
      position: {
        x: Math.max(10, config.position.x + offset),
        y: Math.max(10, config.position.y + offset),
      },
      isMinimized: false,
    }
    setWindows((prev) => [...prev, newWindow])
    setZOrder((prev) => [...prev.filter((z) => z !== id), id])
  }

  const toggleWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    )
    const win = windows.find((w) => w.id === id)
    if (win && win.isMinimized) {
      setZOrder((prev) => [...prev.filter((z) => z !== id), id])
    }
  }

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
    setZOrder((prev) => prev.filter((z) => z !== id))
  }

  const focusWindow = (id) => {
    setZOrder((prev) => [...prev.filter((z) => z !== id), id])
  }

  const handleDrag = (id, position) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    )
  }

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden bg-gray-950 select-none"
      style={{
        transform: `scale(${uiScale})`,
        transformOrigin: 'top left',
        width: `${100 / uiScale}%`,
        height: `${100 / uiScale}%`,
      }}
    >
      <Desktop onOpenWindow={openWindow} studyModeActive={studyModeActive} />

      {windows.map((win) => (
        <WindowManager
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={toggleWindow}
          onFocus={focusWindow}
          onDrag={handleDrag}
          zIndex={getZIndex(win.id)}
        />
      ))}

      <Taskbar
        openWindows={windows}
        onOpenWindow={openWindow}
        onToggleWindow={toggleWindow}
        onCloseWindow={closeWindow}
        onFocusWindow={focusWindow}
        studyModeActive={studyModeActive}
        setStudyModeActive={setStudyModeActive}
        batteryModeActive={batteryModeActive}
        setBatteryModeActive={setBatteryModeActive}
      />
    </div>
  )
}

export default App
