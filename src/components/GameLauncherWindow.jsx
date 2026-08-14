import { useState } from 'react'
import {
  Gamepad2,
  Search,
  Play,
  Clock,
  Star,
  Gauge,
  ChevronRight,
  Filter,
  Grid,
  List,
  Zap,
} from 'lucide-react'

const games = [
  {
    name: 'DOOM Portable',
    genre: 'FPS',
    size: '2.1 GB',
    rating: 4.8,
    hours: 24,
    status: 'Optimizado',
    icon: Gamepad2,
    gradient: 'from-red-600 to-orange-500',
    accent: 'text-red-400',
    fps: 144,
  },
  {
    name: 'Minecraft Portable',
    genre: 'Sandbox',
    size: '580 MB',
    rating: 4.9,
    hours: 86,
    status: 'Listo',
    icon: Gamepad2,
    gradient: 'from-emerald-600 to-green-500',
    accent: 'text-emerald-400',
    fps: 90,
  },
  {
    name: 'Counter-Strike 1.6',
    genre: 'FPS',
    size: '320 MB',
    rating: 4.7,
    hours: 58,
    status: 'Optimizado',
    icon: Gamepad2,
    gradient: 'from-orange-600 to-red-500',
    accent: 'text-orange-400',
    fps: 200,
  },
  {
    name: 'Hotline Miami',
    genre: 'Acción',
    size: '280 MB',
    rating: 4.5,
    hours: 8,
    status: 'Listo',
    icon: Gamepad2,
    gradient: 'from-pink-600 to-rose-500',
    accent: 'text-pink-400',
    fps: 120,
  },
]

const categories = ['Todos', 'FPS', 'Sandbox', 'Acción']

export default function GameLauncherWindow() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todos')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = games.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'Todos' || g.genre === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-full w-full bg-slate-900">
      <div className="w-56 bg-slate-800/60 border-r border-slate-700/60 p-3 flex-shrink-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
            <Gamepad2 size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">Lanzador</h2>
            <p className="text-[10px] text-slate-500">{games.length} juegos</p>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2 px-2">
          Categorías
        </p>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
              category === cat
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-white'
                : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <span className="text-xs font-medium">{cat}</span>
            <ChevronRight
              size={12}
              className={category === cat ? 'text-emerald-400' : 'text-slate-600'}
            />
          </button>
        ))}

        <div className="mt-auto p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-white">Modo Gaming</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight mb-2">
            Optimización activa. +38% FPS promedio
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-bold">ACTIVO</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="h-14 border-b border-slate-700/60 bg-slate-800/40 flex items-center gap-3 px-4 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar juegos..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50">
            <Filter size={14} />
            <span className="text-xs">Filtros</span>
          </button>
          <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <List size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((game, idx) => {
                const GIcon = game.icon
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all"
                  >
                    <div
                      className={`h-32 bg-gradient-to-br ${game.gradient} relative flex items-center justify-center`}
                    >
                      <GIcon size={48} className="text-white/90" />
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        {game.rating}
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-[10px] font-bold text-white">
                        {game.genre}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-bold text-sm">{game.name}</h3>
                        <span className={`text-[10px] font-bold ${game.accent}`}>{game.status}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Tamaño</p>
                          <p className="text-white text-xs font-semibold">{game.size}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Horas</p>
                          <div className="flex items-center gap-1">
                            <Clock size={10} className="text-slate-500" />
                            <p className="text-white text-xs font-semibold">{game.hours}h</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">FPS</p>
                          <div className="flex items-center gap-1">
                            <Gauge size={10} className={game.accent} />
                            <p className={`text-xs font-semibold ${game.accent}`}>{game.fps}</p>
                          </div>
                        </div>
                      </div>
                      <button className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
                        <Play size={12} className="fill-white" />
                        JUGAR
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((game, idx) => {
                const GIcon = game.icon
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <GIcon size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-white font-bold text-sm truncate">{game.name}</h3>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${game.accent} bg-slate-900/60`}>
                          {game.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>{game.genre}</span>
                        <span>·</span>
                        <span>{game.size}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          {game.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-[9px] text-slate-500 uppercase">Horas</p>
                        <p className="text-white text-xs font-bold">{game.hours}h</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-500 uppercase">FPS</p>
                        <p className={`text-xs font-bold ${game.accent}`}>{game.fps}</p>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all">
                        <Play size={12} className="fill-white" />
                        JUGAR
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {filtered.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Gamepad2 size={48} className="mb-3 opacity-50" />
              <p className="text-sm">No se encontraron juegos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}