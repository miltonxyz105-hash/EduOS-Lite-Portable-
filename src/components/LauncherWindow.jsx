import { useState, useMemo } from 'react'
import {
  Search,
  BookOpen,
  FileText,
  Globe,
  Calculator,
  Calendar,
  Image as ImageIcon,
  Video,
  Music,
  Activity,
  Folder,
  Usb,
  Settings,
  Shield,
  Clock,
  Star,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'edu', name: 'Educación' },
  { id: 'office', name: 'Ofimática' },
  { id: 'media', name: 'Medios' },
  { id: 'tools', name: 'Herramientas' },
  { id: 'system', name: 'Sistema' },
]

const APPS = [
  { id: 'edu-1', name: 'EduBrowser · Navegador Web', desc: 'Navegador oficial Modo Estudio Seguro', cat: 'edu', icon: Globe, color: 'bg-blue-500', recent: true, freq: 10, openId: 'browser' },
  { id: 'edu-2', name: 'Plataforma LMS', desc: 'Moodle / Aula Virtual', cat: 'edu', icon: Globe, color: 'bg-cyan-500', recent: true, freq: 8 },
  { id: 'edu-3', name: 'Visor PDF', desc: 'Libros digitales y apuntes', cat: 'edu', icon: BookOpen, color: 'bg-emerald-500', recent: true, freq: 9 },
  { id: 'edu-4', name: 'Calculadora Científica', desc: 'Álgebra, cálculo, estadística', cat: 'edu', icon: Calculator, color: 'bg-violet-500', recent: false, freq: 5 },
  { id: 'edu-5', name: 'Agenda Escolar', desc: 'Horarios y fechas de exámenes', cat: 'edu', icon: Calendar, color: 'bg-pink-500', recent: true, freq: 6 },

  { id: 'off-1', name: 'Editor de Texto', desc: 'Documentos y trabajos escritos', cat: 'office', icon: FileText, color: 'bg-blue-500', recent: true, freq: 10 },
  { id: 'off-2', name: 'Hoja de Cálculo', desc: 'Planillas y finanzas', cat: 'office', icon: FileText, color: 'bg-green-500', recent: false, freq: 4 },
  { id: 'off-3', name: 'Presentaciones', desc: 'Diapositivas y clases', cat: 'office', icon: FileText, color: 'bg-orange-500', recent: false, freq: 3 },

  { id: 'med-1', name: 'Visor de Imágenes', desc: 'Galería educativa', cat: 'media', icon: ImageIcon, color: 'bg-rose-500', recent: false, freq: 2 },
  { id: 'med-2', name: 'Reproductor Video', desc: 'Clases grabadas', cat: 'media', icon: Video, color: 'bg-indigo-500', recent: true, freq: 7 },
  { id: 'med-3', name: 'Reproductor Audio', desc: 'Podcasts y audiolibros', cat: 'media', icon: Music, color: 'bg-fuchsia-500', recent: false, freq: 1 },

  { id: 't-1', name: 'Explorador Archivos', desc: 'Gestión de documentos', cat: 'tools', icon: Folder, color: 'bg-blue-600', recent: true, freq: 10 },
  { id: 't-2', name: 'Limpiador RAM', desc: 'Optimizar rendimiento', cat: 'tools', icon: Activity, color: 'bg-green-600', recent: true, freq: 6 },
  { id: 't-3', name: 'Respaldo USB', desc: 'Copia de seguridad portátil', cat: 'tools', icon: Usb, color: 'bg-cyan-600', recent: false, freq: 3 },

  { id: 's-1', name: 'Configuración', desc: 'Ajustes del sistema', cat: 'system', icon: Settings, color: 'bg-slate-600', recent: false, freq: 4 },
  { id: 's-2', name: 'Modo Estudio', desc: 'Anti-distracciones', cat: 'system', icon: Shield, color: 'bg-emerald-600', recent: true, freq: 7 },
  { id: 's-3', name: 'Visor Procesos', desc: 'Monitor de recursos', cat: 'system', icon: Activity, color: 'bg-amber-600', recent: false, freq: 2 },
]

export default function LauncherWindow() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return APPS.filter((a) => {
      const matchesCat = category === 'all' || a.cat === category
      const matchesQuery = !query ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.desc.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [query, category])

  const recents = APPS.filter((a) => a.recent).slice(0, 5)
  const pinned = [...APPS].sort((a, b) => b.freq - a.freq).slice(0, 6)

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex flex-col text-xs">
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aplicaciones, documentos, configuración..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex gap-1 mt-3 overflow-x-auto pb-0.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                category === c.id
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {!query && category === 'all' && (
        <div className="px-3 pt-3 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={11} className="text-amber-400" />
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Más Usadas
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {pinned.map((a) => {
                const Icon = a.icon
                return (
                  <button
                    key={a.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800/60 text-left border border-transparent hover:border-slate-700 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${a.color}`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-white truncate">{a.name}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock size={11} className="text-blue-400" />
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Recientes
              </span>
            </div>
            <div className="space-y-1">
              {recents.map((a) => {
                const Icon = a.icon
                return (
                  <button
                    key={a.id}
                    className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-800/60 text-left"
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${a.color}`}>
                      <Icon size={13} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-white truncate">{a.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{a.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-3">
        {(query || category !== 'all') && (
          <>
            <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-2">
              {filtered.length} resultado{filtered.length !== 1 && 's'}
            </div>
            <div className="space-y-1">
              {filtered.map((a) => {
                const Icon = a.icon
                return (
                  <button
                    key={a.id}
                    className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-800/60 text-left"
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${a.color}`}>
                      <Icon size={15} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-white">{a.name}</div>
                      <div className="text-[10px] text-slate-500">{a.desc}</div>
                    </div>
                    <div className="text-[9px] uppercase text-slate-600 px-1.5 py-0.5 rounded bg-slate-800">
                      {CATEGORIES.find((c) => c.id === a.cat)?.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
