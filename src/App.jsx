import { useState } from 'react'
import { Folder, Settings, Gamepad2, Trash2 } from 'lucide-react'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import WindowManager from './components/WindowManager'
import FileExplorerWindow from './components/FileExplorerWindow'
import SettingsWindow from './components/SettingsWindow'
import GameLauncherWindow from './components/GameLauncherWindow'
import TrashWindow from './components/TrashWindow'

const WINDOW_CONFIGS = {
  files: {
    id: 'files',
    title: 'Explorador de Archivos',
    icon: Folder,
    color: 'text-red-500',
    Component: FileExplorerWindow,
    position: { x: 120, y: 80 },
    size: { width: 960, height: 600 },
  },
  settings: {
    id: 'settings',
    title: 'Configuración',
    icon: Settings,
    color: 'text-red-400',
    Component: SettingsWindow,
    position: { x: 200, y: 110 },
    size: { width: 720, height: 520 },
  },
  games: {
    id: 'games',
    title: 'Lanzador de Juegos',
    icon: Gamepad2,
    color: 'text-red-500',
    Component: GameLauncherWindow,
    position: { x: 150, y: 90 },
    size: { width: 1000, height: 640 },
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
}

function App() {
  const [isLocked, setIsLocked] = useState(true)
  const [windows, setWindows] = useState([])
  const [zOrder, setZOrder] = useState([])

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
    const offset = windows.length * 28
    const newWindow = {
      ...config,
      position: {
        x: config.position.x + offset,
        y: config.position.y + offset,
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

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-black select-none">
      <Desktop onOpenWindow={openWindow} />

      {windows.map((win) => (
        <WindowManager
          key={win.id}
          window={win}
          onClose={closeWindow}
          onMinimize={toggleWindow}
          onFocus={focusWindow}
          zIndex={getZIndex(win.id)}
        />
      ))}

      <Taskbar
        openWindows={windows}
        onOpenWindow={openWindow}
        onToggleWindow={toggleWindow}
        onCloseWindow={closeWindow}
        onFocusWindow={focusWindow}
      />
    </div>
  )
}

export default App