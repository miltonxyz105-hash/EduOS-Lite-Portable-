import { useState } from 'react'
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Search,
  Home,
  BookOpen,
  Library,
  FileText,
  GraduationCap,
  Wrench,
  BookMarked,
  History,
  Shield,
  Loader2,
} from 'lucide-react'

const HOME_URL = 'eduos://home'
const DEFAULT_ADDRESS = 'eduos://home'

const BOOKMARKS = [
  {
    name: 'Recursos Educativos',
    description: 'Moodle, Campus, Khan Academy, UNED',
    icon: GraduationCap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    hoverBg: 'hover:bg-blue-500/20',
    url: 'https://recursos.eduos.edu',
  },
  {
    name: 'Herramientas EduOS',
    description: 'Limpiador, Procesos, Modo Estudio, Backup USB',
    icon: Wrench,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    hoverBg: 'hover:bg-emerald-500/20',
    url: 'eduos://tools',
  },
  {
    name: 'Documentación',
    description: 'Guías, Manuales y FAQ del sistema',
    icon: FileText,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    hoverBg: 'hover:bg-amber-500/20',
    url: 'https://docs.eduos.edu',
  },
  {
    name: 'Biblioteca Digital',
    description: 'Libros, Artículos y E-books académicos',
    icon: Library,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    hoverBg: 'hover:bg-violet-500/20',
    url: 'https://library.eduos.edu',
  },
  {
    name: 'Exámenes y Tareas',
    description: 'Plataforma evaluación Docente / Alumno',
    icon: BookMarked,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    hoverBg: 'hover:bg-cyan-500/20',
    url: 'https://exam.eduos.edu',
  },
  {
    name: 'Historial Navegación',
    description: 'Sitios y páginas recientemente visitadas',
    icon: History,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    hoverBg: 'hover:bg-slate-500/20',
    url: 'eduos://history',
  },
]

const SHORTCUTS = [
  { name: 'Google Académico', icon: BookOpen, url: 'https://scholar.google.com' },
  { name: 'Wikipedia', icon: BookMarked, url: 'https://wikipedia.org' },
  { name: 'Khan Academy', icon: GraduationCap, url: 'https://es.khanacademy.org' },
  { name: 'UNED', icon: Library, url: 'https://www.uned.es' },
  { name: 'GitHub Docs', icon: FileText, url: 'https://docs.github.com' },
]

export default function BrowserWindow() {
  const [address, setAddress] = useState(DEFAULT_ADDRESS)
  const [current, setCurrent] = useState(HOME_URL)
  const [history, setHistory] = useState([HOME_URL])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const go = (dest) => {
    if (!dest) return
    const url = dest === HOME_URL ? HOME_URL : /^https?:/i.test(dest) ? dest : `https://${dest}`
    setLoading(true)
    setTimeout(() => {
      const next = history.slice(0, index + 1)
      next.push(url)
      setHistory(next)
      setIndex(next.length - 1)
      setCurrent(url)
      setAddress(url)
      setLoading(false)
    }, 420)
  }

  const back = () => {
    if (index <= 0) return
    const i = index - 1
    setIndex(i)
    setCurrent(history[i])
    setAddress(history[i])
  }

  const forward = () => {
    if (index >= history.length - 1) return
    const i = index + 1
    setIndex(i)
    setCurrent(history[i])
    setAddress(history[i])
  }

  const refresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  const home = () => {
    go(HOME_URL)
  }

  const handleSearch = (text) => {
    const q = (text || address || '').trim()
    if (!q) return
    if (/^eduos:\/\//i.test(q) || /^https?:/i.test(q) || /^\S+\.\S+$/.test(q)) {
      go(q)
    } else {
      go(`https://www.google.com/search?q=${encodeURIComponent(q)}`)
    }
  }

  const isHome = current === HOME_URL

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 flex flex-col text-xs">
      {/* Top Bar / Toolbar del navegador */}
      <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-slate-800 bg-slate-900/60">
        <button
          type="button"
          onClick={back}
          disabled={index <= 0}
          className={
            'p-1.5 rounded-md transition-colors flex-shrink-0 ' +
            (index <= 0
              ? 'text-slate-700 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800')
          }
          aria-label="Atrás"
          title="Atrás"
        >
          <ArrowLeft size={14} />
        </button>
        <button
          type="button"
          onClick={forward}
          disabled={index >= history.length - 1}
          className={
            'p-1.5 rounded-md transition-colors flex-shrink-0 ' +
            (index >= history.length - 1
              ? 'text-slate-700 cursor-not-allowed'
              : 'text-slate-300 hover:text-white hover:bg-slate-800')
          }
          aria-label="Adelante"
          title="Adelante"
        >
          <ArrowRight size={14} />
        </button>
        <button
          type="button"
          onClick={refresh}
          className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
          aria-label="Actualizar"
          title="Actualizar"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin text-blue-400" />
          ) : (
            <RefreshCw size={14} />
          )}
        </button>
        <button
          type="button"
          onClick={home}
          className="p-1.5 rounded-md text-blue-400 hover:text-white hover:bg-blue-500/15 transition-colors flex-shrink-0"
          aria-label="Inicio"
          title="Página de inicio"
        >
          <Home size={14} />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/40 transition">
          <Globe size={13} className="flex-shrink-0 text-blue-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(address)
            }}
            className="flex-1 min-w-0 bg-transparent outline-none text-[11px] font-mono text-slate-200 placeholder:text-slate-600"
            placeholder="Busca en la web o introduce una URL…"
            spellCheck={false}
          />
        </div>

        <button
          type="button"
          onClick={() => handleSearch(address)}
          className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white flex items-center gap-1 transition-colors flex-shrink-0"
          title="Buscar"
        >
          <Search size={13} />
          <span className="text-[10px] font-semibold">Buscar</span>
        </button>
      </div>

      {/* Barra de estado: URL actual + seguridad */}
      <div className="px-3 py-1 flex items-center justify-between border-b border-slate-800/70 bg-slate-900/30">
        <div className="flex items-center gap-1.5 min-w-0">
          {isHome ? (
            <Globe size={11} className="text-emerald-500 flex-shrink-0" />
          ) : /^https:/i.test(current) ? (
            <Shield size={11} className="text-emerald-500 flex-shrink-0" />
          ) : (
            <Shield size={11} className="text-amber-500 flex-shrink-0" />
          )}
          <span className="truncate text-[10px] text-slate-400 font-mono">
            {current}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">
          {loading ? 'Cargando…' : 'Listo · 4 KB · 16 ms'}
        </span>
      </div>

      {/* Contenido: Home vs navegado */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/60">
        {isHome ? (
          <div className="max-w-5xl mx-auto px-5 py-6 flex flex-col gap-6">
            {/* Hero: Logo EduBrowser + search central */}
            <div className="flex flex-col items-center text-center gap-4 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30">
                  <Globe size={26} className="text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white leading-tight tracking-tight">
                    EduBrowser
                  </div>
                  <div className="text-[11px] text-slate-500 -mt-0.5">
                    Navegador oficial de EduOS · Modo Estudio seguro
                  </div>
                </div>
              </div>

              <div className="w-full max-w-2xl mt-2">
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-blue-500/50 shadow-2xl shadow-blue-500/5">
                  <Search size={16} className="text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Busca en EduOS o en la web · Presiona Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch(e.target.value)
                    }}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-600"
                    spellCheck={false}
                  />
                  <div className="text-[9px] uppercase tracking-wider text-slate-600 border border-slate-800 rounded px-2 py-1 font-semibold">
                    Enter
                  </div>
                </div>
              </div>

              {/* Atajos rápidos */}
              <div className="flex flex-wrap justify-center gap-2 mt-1 max-w-2xl">
                {SHORTCUTS.map((s) => {
                  const Icon = s.icon
                  return (
                    <button
                      type="button"
                      key={s.name}
                      onClick={() => go(s.url)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 hover:text-white transition-colors"
                    >
                      <Icon size={12} className="text-blue-400 flex-shrink-0" />
                      {s.name}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Grid tarjetas marcadores */}
            <div>
              <div className="flex items-center justify-between mb-3 px-0.5">
                <div className="flex items-center gap-2">
                  <BookMarked size={13} className="text-blue-400" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                    Marcadores rápidos
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => go('eduos://bookmarks')}
                  className="text-[10px] text-slate-500 hover:text-blue-400 transition-colors"
                >
                  Ver todos →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BOOKMARKS.map((b) => {
                  const Icon = b.icon
                  return (
                    <button
                      type="button"
                      key={b.name}
                      onClick={() => go(b.url)}
                      className={
                        'group text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 ' +
                        b.hoverBg +
                        ' transition-all hover:border-blue-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10'
                      }
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={
                            'p-2 rounded-lg border border-slate-800 flex-shrink-0 ' +
                            b.bgColor
                          }
                        >
                          <Icon size={16} className={b.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {b.name}
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                            {b.description}
                          </p>
                          <div className="mt-2 text-[9.5px] font-mono text-slate-600 truncate">
                            {b.url}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Strip: Modo Seguro Estudio activo */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Shield size={15} className="text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-emerald-300">
                  Modo Estudio Seguro · Anti-Distracciones activo
                </div>
                <div className="text-[10px] text-emerald-400/70">
                  Redes sociales, contenido no educativo y scripts de tracking bloqueados.
                  Historial cifrado AES-256 en el espacio de estudiante.
                </div>
              </div>
              <button
                type="button"
                onClick={() => go('eduos://study-settings')}
                className="flex-shrink-0 px-2.5 py-1 rounded-md border border-emerald-500/30 text-[10px] text-emerald-300 hover:bg-emerald-500/15 transition-colors"
              >
                Configurar
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-5 py-8 flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <Globe size={38} className="text-blue-500" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white">
                Navegación externa simulada
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                EduOS Lite corre en un entorno sandbox seguro y no abre iframes con dominios externos sin
                consentimiento explícito. Para abrir este recurso utiliza el link real:
              </div>
            </div>
            <a
              href={current}
              target="_blank"
              rel="noreferrer noopener nofollow"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-semibold transition-colors shadow shadow-blue-500/30"
            >
              <ExternalLinkFallback />
              Abrir en pestaña real: {current.length > 52 ? current.slice(0, 52) + '…' : current}
            </a>
            <div className="mt-4 w-full max-w-xl">
              <div className="text-[10px] uppercase tracking-wider text-slate-600 mb-2 font-semibold">
                Acciones rápidas
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={home}
                  className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 hover:text-white"
                >
                  ← Volver al inicio
                </button>
                <button
                  type="button"
                  onClick={refresh}
                  className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 hover:text-white"
                >
                  Reintentar carga
                </button>
                <button
                  type="button"
                  onClick={() => go(HOME_URL)}
                  className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 hover:text-white"
                >
                  eduos://home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ExternalLinkFallback() {
  // lucide-react no siempre exporta ExternalLink; evitamos ReferenceError
  try {
    // intentamos cargar dinamicamente via require no es option en ESM Vite
    // fallback inline SVG
  } catch (_e) {
    // ignore
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
