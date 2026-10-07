import { useState, useEffect } from 'react'
import LockScreen from './components/LockScreen'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import WindowManager from './components/WindowManager'
import {
  WINDOW_CONFIGS,
  makeWindow,
  closeWindow as reduceCloseWindow,
  toggleMinimize,
  focusTop,
  moveWindow,
  zIndexOf,
} from './state/windows'
import {
  getUiScale,
  DEFAULT_APP_STATES,
} from './state/screens'

function App() {
  const [isLocked, setIsLocked] = useState(DEFAULT_APP_STATES.locked)
  const [windows, setWindows] = useState([])
  const [zOrder, setZOrder] = useState([])
  const [uiScale, setUiScale] = useState(1.0)
  const [studyModeActive, setStudyModeActive] = useState(
    DEFAULT_APP_STATES.studyModeActive
  )
  const [batteryModeActive, setBatteryModeActive] = useState(
    DEFAULT_APP_STATES.batteryModeActive
  )

  useEffect(() => {
    const applyDynamicScaling = () => setUiScale(getUiScale(window.innerWidth))
    applyDynamicScaling()
    window.addEventListener('resize', applyDynamicScaling)
    return () => window.removeEventListener('resize', applyDynamicScaling)
  }, [])

  const handleUnlock = () => setIsLocked(false)

  const openWindow = (id) => {
    if (!(id in WINDOW_CONFIGS)) return
    const existing = windows.find((w) => w.id === id)
    if (existing) {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isMinimized: false } : w))
      )
      setZOrder((prev) => focusTop(prev, id))
      return
    }
    const config = WINDOW_CONFIGS[id]
    const newWindow = makeWindow(config, windows.length)
    setWindows((prev) => [...prev, newWindow])
    setZOrder((prev) => focusTop(prev, id))
  }

  const toggleWindow = (id) => {
    setWindows((prev) => {
      const next = toggleMinimize(prev, id)
      const win = next.find((w) => w.id === id)
      if (win && win.isMinimized === false) {
        setZOrder((zPrev) => focusTop(zPrev, id))
      }
      return next
    })
  }

  const closeWindow = (id) => {
    setWindows((prev) => reduceCloseWindow(prev, id))
    setZOrder((prev) => prev.filter((z) => z !== id))
  }

  const focusWindow = (id) => setZOrder((prev) => focusTop(prev, id))

  const handleDrag = (id, position) =>
    setWindows((prev) => moveWindow(prev, id, position))

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
          zIndex={zIndexOf(zOrder, win.id)}
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
