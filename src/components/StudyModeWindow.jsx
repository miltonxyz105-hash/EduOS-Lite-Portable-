import { useState } from 'react'
import {
  BookOpen,
  ShieldCheck,
  BellOff,
  Globe,
  ShieldX,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  Target,
  ListChecks,
  Plus,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'

const DEFAULT_BLOCKED = [
  { domain: 'facebook.com', type: 'Red Social', active: true },
  { domain: 'instagram.com', type: 'Red Social', active: true },
  { domain: 'twitter.com', type: 'Red Social', active: true },
  { domain: 'tiktok.com', type: 'Video/Entretenimiento', active: true },
  { domain: 'youtube.com', type: 'Video Streaming', active: true },
  { domain: 'twitch.tv', type: 'Streaming Gaming', active: true },
  { domain: 'discord.com', type: 'Chat/Gaming', active: true },
  { domain: 'reddit.com', type: 'Foro', active: false },
]

const WHITELIST = [
  { domain: 'classroom.google.com', type: 'LMS Google' },
  { domain: 'moodle.*', type: 'LMS Moodle (wildcard)' },
  { domain: 'educacion.gob.ar', type: 'Plataforma Oficial' },
  { domain: 'campus.*.edu', type: 'Campus Universitario' },
  { domain: 'wikipedia.org', type: 'Enciclopedia' },
  { domain: 'khanacademy.org', type: 'Plataforma Edu' },
]

export default function StudyModeWindow() {
  const [studyActive, setStudyActive] = useState(false)
  const [blockAlerts, setBlockAlerts] = useState(true)
  const [throttleBg, setThrottleBg] = useState(true)
  const [blocked, setBlocked] = useState(DEFAULT_BLOCKED)
  const [session, setSession] = useState({ minutes: 0, targets: 4, done: 2 })
  const [customDomain, setCustomDomain] = useState('')

  const toggleBlocked = (idx) => {
    setBlocked((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, active: !b.active } : b))
    )
  }

  const addDomain = () => {
    if (!customDomain.trim()) return
    setBlocked((prev) => [
      ...prev,
      { domain: customDomain.trim().toLowerCase(), type: 'Personalizado', active: true },
    ])
    setCustomDomain('')
  }

  const activeBlockCount = blocked.filter((b) => b.active).length
  const progressPct = Math.min((session.done / session.targets) * 100, 100)

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex flex-col text-xs">
      <div className={`p-3 border-b flex items-center justify-between ${
        studyActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-950/60 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            studyActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
          }`}>
            <BookOpen size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Modo Estudio</span>
              {studyActive && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  ACTIVO
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Filtro anti-distracciones + Enfoque en apps educativas
            </p>
          </div>
        </div>
        <button
          onClick={() => setStudyActive(!studyActive)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-[11px]"
        >
          {studyActive ? (
            <>
              <XCircle size={13} className="text-red-400" />
              <span className="text-red-400 border-red-500/30">Desactivar</span>
            </>
          ) : (
            <>
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-emerald-400 border-emerald-500/30">Activar</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-800">
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={11} className="text-blue-500" />
            <span className="text-[9px] uppercase font-semibold text-slate-500">Sesión</span>
          </div>
          <div className="text-sm font-bold text-blue-400">{session.minutes} min</div>
          <div className="text-[10px] text-slate-500">Tiempo concentración</div>
        </div>
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Target size={11} className="text-amber-500" />
            <span className="text-[9px] uppercase font-semibold text-slate-500">Metas</span>
          </div>
          <div className="text-sm font-bold text-amber-400">{session.done}/{session.targets}</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldX size={11} className="text-rose-500" />
            <span className="text-[9px] uppercase font-semibold text-slate-500">Bloqueados</span>
          </div>
          <div className="text-sm font-bold text-rose-400">{activeBlockCount}</div>
          <div className="text-[10px] text-slate-500">dominios filtrados</div>
        </div>
      </div>

      <div className="p-3 space-y-2 border-b border-slate-800">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
          Comportamiento
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <BellOff size={15} className="text-slate-400" />
            <div>
              <div className="text-[12px] font-medium text-white">Silenciar notificaciones</div>
              <div className="text-[10px] text-slate-500">Solo alertas críticas permitidas</div>
            </div>
          </div>
          <button onClick={() => setBlockAlerts(!blockAlerts)}>
            {blockAlerts ? <ToggleRight size={24} className="text-blue-500" /> : <ToggleLeft size={24} className="text-slate-600" />}
          </button>
        </div>

        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <Zap size={15} className="text-amber-500" />
            <div>
              <div className="text-[12px] font-medium text-white">Reducir procesos de fondo</div>
              <div className="text-[10px] text-slate-500">CPU y RAM para apps en primer plano</div>
            </div>
          </div>
          <button onClick={() => setThrottleBg(!throttleBg)}>
            {throttleBg ? <ToggleRight size={24} className="text-blue-500" /> : <ToggleLeft size={24} className="text-slate-600" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ListChecks size={12} className="text-rose-500" />
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Lista Negra
              </span>
            </div>
          </div>

          <div className="flex gap-1 mb-2">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDomain()}
              placeholder="dominio.com"
              className="flex-1 px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-md text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50"
            />
            <button
              onClick={addDomain}
              className="px-2 py-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-md hover:bg-rose-500/25"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="space-y-1">
            {blocked.map((b, i) => (
              <button
                key={`${b.domain}-${i}`}
                onClick={() => toggleBlocked(i)}
                className={`w-full flex items-center justify-between p-1.5 rounded-md border text-left ${
                  b.active
                    ? 'bg-rose-500/8 border-rose-500/25'
                    : 'bg-slate-800/40 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {b.active ? (
                    <ShieldX size={11} className="text-rose-400 flex-shrink-0" />
                  ) : (
                    <ShieldCheck size={11} className="text-slate-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-200 truncate">{b.domain}</div>
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 flex-shrink-0 ml-1">
                  {b.type}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle size={12} className="text-emerald-500" />
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Lista Blanca (Siempre)
            </span>
          </div>
          <div className="space-y-1">
            {WHITELIST.map((w) => (
              <div
                key={w.domain}
                className="flex items-center justify-between p-1.5 rounded-md bg-emerald-500/8 border border-emerald-500/25"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Globe size={11} className="text-emerald-400 flex-shrink-0" />
                  <div className="text-[11px] font-mono text-slate-200 truncate">{w.domain}</div>
                </div>
                <span className="text-[9px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 flex-shrink-0 ml-1">
                  {w.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
