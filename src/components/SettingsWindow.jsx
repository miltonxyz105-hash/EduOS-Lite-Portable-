import { useState } from 'react'
import {
  Settings,
  Cpu,
  Zap,
  Info,
  ToggleLeft,
  ToggleRight,
  Check,
  RefreshCw,
  Database,
  ShieldCheck,
  Monitor,
  BookOpen,
  Gauge,
  Layers,
  Activity,
  MemoryStick,
} from 'lucide-react'

export default function SettingsWindow() {
  const [zramActive, setZramActive] = useState(true)
  const [cpuPinning, setCpuPinning] = useState(true)
  const [bloatShield, setBloatShield] = useState(true)
  const [autoScaling, setAutoScaling] = useState(true)
  const [savingIdx, setSavingIdx] = useState(null)
  const [activeTab, setActiveTab] = useState('hardware')

  const toggleWithDelay = (setter, current, idx) => {
    setSavingIdx(idx)
    setTimeout(() => {
      setter(!current)
      setSavingIdx(null)
    }, 300)
  }

  return (
    <div className="flex h-full bg-slate-900 text-slate-100 font-sans select-none text-xs">
      <div className="w-48 bg-slate-950 border-r border-slate-800 p-2.5 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 px-2.5 py-2 text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-1.5">
          <Settings size={14} />
          Configuración OS
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'hardware'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Cpu size={14} />
          Opt. Hardware
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <BookOpen size={14} />
          Perfil Edu
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('display')}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'display'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Monitor size={14} />
          Pantalla
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-2.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Info size={14} />
          Acerca de
        </button>
      </div>

      <div className="flex-1 p-5 overflow-auto">
        {activeTab === 'hardware' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-0.5">Optimizaciones Hardware</h2>
              <p className="text-[11px] text-slate-400">Configuración para equipos de bajos recursos (2-4GB RAM, dual-core).</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Auto ZRAM</h3>
                  <p className="text-[10px] text-slate-400">Compresión dinámica de RAM. Expande memoria efectiva ~50%.</p>
                </div>
              </div>
              <button onClick={() => toggleWithDelay(setZramActive, zramActive, 0)}>
                {savingIdx === 0 ? <RefreshCw size={26} className="animate-spin text-blue-500" /> :
                 zramActive ? <ToggleRight size={28} className="text-blue-500" /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">CPU Core Pinning</h3>
                  <p className="text-[10px] text-slate-400">Aísla procesos de fondo. Prioriza apps educativas en foreground.</p>
                </div>
              </div>
              <button onClick={() => toggleWithDelay(setCpuPinning, cpuPinning, 1)}>
                {savingIdx === 1 ? <RefreshCw size={26} className="animate-spin text-blue-500" /> :
                 cpuPinning ? <ToggleRight size={28} className="text-blue-500" /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Bloatware Shield</h3>
                  <p className="text-[10px] text-slate-400">Daemon de inicio. Bloquea procesos pesados no autorizados.</p>
                </div>
              </div>
              <button onClick={() => toggleWithDelay(setBloatShield, bloatShield, 2)}>
                {savingIdx === 2 ? <RefreshCw size={26} className="animate-spin text-blue-500" /> :
                 bloatShield ? <ToggleRight size={28} className="text-blue-500" /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2.5">
                <MemoryStick size={16} className="text-green-400" />
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">RAM Efectiva</div>
                  <div className="text-[11px] font-semibold text-green-400">{zramActive ? '~6 GB (ZRAM)' : '4 GB'}</div>
                </div>
              </div>
              <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2.5">
                <Activity size={16} className="text-green-400" />
                <div>
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">CPU Idle</div>
                  <div className="text-[11px] font-semibold text-green-400">{cpuPinning ? '0.9%' : '1.8%'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-0.5">Perfil Educativo</h2>
              <p className="text-[11px] text-slate-400">Modos de productividad y anti-distracciones.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-500" />
                <h3 className="text-xs font-semibold text-white">Modo Estudio (Anti-Distracciones)</h3>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-1 pl-7 list-disc">
                <li>Bloquea dominios: redes sociales, streaming, gaming</li>
                <li>Suprime notificaciones no esenciales</li>
                <li>Lista blanca: plataformas edu, correo institucional</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <h3 className="text-xs font-semibold text-white">Modo Batería Extrema / Stealth</h3>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-1 pl-7 list-disc">
                <li>CPU throttling agresivo en idle</li>
                <li>Suspende servicios no esenciales (update, indexado)</li>
                <li>Reduce brillo y refresco de pantalla automáticamente</li>
              </ul>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-blue-500" />
                <h3 className="text-xs font-semibold text-white">Procesos Prioritarios (Foreground)</h3>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-1 pl-7 list-disc">
                <li>Navegador educativo (plataformas LMS)</li>
                <li>Suite ofimática / editor de documentos</li>
                <li>Visor PDF / libros digitales</li>
                <li>Reproductor de videos clase</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-0.5">Escalado Dinámico de Pantalla</h2>
              <p className="text-[11px] text-slate-400">Optimiza UI para pantallas de baja resolución (netbooks).</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500">
                  <Monitor size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Auto-Escalado UI</h3>
                  <p className="text-[10px] text-slate-400">Ajusta tamaño según resolución detectada.</p>
                </div>
              </div>
              <button onClick={() => toggleWithDelay(setAutoScaling, autoScaling, 3)}>
                {savingIdx === 3 ? <RefreshCw size={26} className="animate-spin text-blue-500" /> :
                 autoScaling ? <ToggleRight size={28} className="text-blue-500" /> : <ToggleLeft size={28} className="text-slate-600" />}
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <h3 className="text-xs font-semibold text-white">Perfiles Soportados</h3>
              {[
                { res: '1024 x 600', name: 'Netbook 7-10"', scale: '85%', tag: 'LOW' },
                { res: '1366 x 768', name: 'Laptop básica', scale: '92%', tag: 'MED' },
                { res: '1920 x 1080', name: 'Full HD', scale: '100%', tag: 'STD' },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] bg-slate-900/60 rounded-md px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-200">{p.res}</span>
                    <span className="text-slate-500">{p.name}</span>
                  </div>
                  <span className="text-blue-400 font-semibold">{p.scale} · {p.tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-0.5">EduOS Lite</h2>
              <p className="text-[11px] text-slate-400">Government & Educational Tender Edition.</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2">
                <span className="text-slate-400">Edición</span>
                <span className="text-blue-400 font-semibold">EduOS Lite - GovEdu v2.0</span>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2">
                <span className="text-slate-400">Perfil Destino</span>
                <span className="text-slate-200">Gobierno / Educación</span>
              </div>
              <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-2">
                <span className="text-slate-400">HW Mínimo Recomendado</span>
                <span className="text-slate-200">2GB RAM / Dual-Core</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Kernel</span>
                <span className="text-green-400 flex items-center gap-1 font-medium">
                  <Check size={13} /> Ultra Optimizado (Low-Latency)
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2.5">
              <h3 className="text-xs font-semibold text-white">Certificaciones</h3>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /> Cero telemetría / Datos locales</li>
                <li className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /> Sin bloatware / Sin anuncios</li>
                <li className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /> Modo offline completo</li>
                <li className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /> Filtro de contenido integrado</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
