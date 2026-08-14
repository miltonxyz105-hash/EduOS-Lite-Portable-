import { useState } from 'react'
import {
  Trash2,
  Folder,
  FileText,
  Image as ImageIcon,
  Music,
  Film,
  RotateCcw,
  Trash,
  Search,
} from 'lucide-react'

const initialTrashItems = [
  { name: 'Captura_Antigua.png', type: 'image', size: '2.4 MB', date: '10/08/2026', icon: ImageIcon, color: 'text-blue-400' },
  { name: 'Setup_Antiguo.exe', type: 'file', size: '48 MB', date: '08/08/2026', icon: FileText, color: 'text-emerald-400' },
  { name: 'Carpeta_Vieja', type: 'folder', size: '120 MB', date: '05/08/2026', icon: Folder, color: 'text-amber-400' },
  { name: 'Soundtrack_Old.mp3', type: 'music', size: '8.2 MB', date: '03/08/2026', icon: Music, color: 'text-pink-400' },
  { name: 'Gameplay_Clip.mp4', type: 'video', size: '156 MB', date: '01/08/2026', icon: Film, color: 'text-violet-400' },
]

export default function TrashWindow() {
  const [items, setItems] = useState(initialTrashItems)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  const restoreItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx))
    setSelected(null)
  }

  const deletePermanent = (idx) => {
    setItems(items.filter((_, i) => i !== idx))
    setSelected(null)
  }

  const emptyTrash = () => setItems([])

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="h-12 border-b border-slate-700/60 bg-slate-800/40 flex items-center justify-between gap-2 px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-slate-400" />
          <span className="text-white text-sm font-semibold">Papelera de Reciclaje</span>
          <span className="text-slate-500 text-xs">({items.length} elementos)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900/70 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <button
            onClick={emptyTrash}
            disabled={items.length === 0}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <Trash size={13} />
            Vaciar Papelera
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Trash2 size={56} className="mb-3 opacity-40" />
            <p className="text-lg font-semibold text-slate-400 mb-1">Papelera Vacía</p>
            <p className="text-sm">Los archivos eliminados aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((item, idx) => {
              const IIcon = item.icon
              const isSelected = selected === idx
              return (
                <div
                  key={idx}
                  onClick={() => setSelected(idx)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-slate-600'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center ${item.color}`}>
                    <IIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-slate-500 text-[11px]">
                      {item.type.toUpperCase()} · {item.size} · Eliminado el {item.date}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          restoreItem(idx)
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/30 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw size={12} />
                        Restaurar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePermanent(idx)
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-semibold hover:bg-red-500/30 flex items-center gap-1 transition-colors"
                      >
                        <Trash size={12} />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
