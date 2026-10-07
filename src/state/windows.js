import { Folder, Settings, Trash2, BookOpen, Activity, Search, Usb } from 'lucide-react'
import FileExplorerWindow from '../components/FileExplorerWindow'
import SettingsWindow from '../components/SettingsWindow'
import TrashWindow from '../components/TrashWindow'
import SystemCleanerWindow from '../components/SystemCleanerWindow'
import ProcessViewerWindow from '../components/ProcessViewerWindow'
import LauncherWindow from '../components/LauncherWindow'
import StudyModeWindow from '../components/StudyModeWindow'
import USBSyncWindow from '../components/USBSyncWindow'

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

const WINDOW_CASCADE_OFFSET = 24
const WINDOW_MIN_EDGE = 10

function makeWindow(config, offsetIndex = 0) {
  const offset = (offsetIndex || 0) * WINDOW_CASCADE_OFFSET
  return {
    ...config,
    position: {
      x: Math.max(WINDOW_MIN_EDGE, config.position.x + offset),
      y: Math.max(WINDOW_MIN_EDGE, config.position.y + offset),
    },
    isMinimized: false,
  }
}

function closeWindow(state, id) {
  return state.filter((w) => w.id !== id)
}

function toggleMinimize(state, id) {
  return state.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
}

function focusTop(zOrder, id) {
  return [...zOrder.filter((z) => z !== id), id]
}

function moveWindow(state, id, position) {
  const px = typeof position?.x === 'number' ? position.x : 0
  const py = typeof position?.y === 'number' ? position.y : 0
  return state.map((w) =>
    w.id === id
      ? {
          ...w,
          position: {
            x: Math.max(0, px),
            y: Math.max(0, py),
          },
        }
      : w
  )
}

function zIndexOf(zOrder, id, base = 100) {
  const idx = zOrder.indexOf(id)
  return idx === -1 ? base : base + idx + 1
}

export {
  WINDOW_CONFIGS,
  makeWindow,
  closeWindow,
  toggleMinimize,
  focusTop,
  moveWindow,
  zIndexOf,
}
