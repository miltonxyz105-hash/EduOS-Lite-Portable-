import { useState, useEffect } from 'react'
import {
  Cpu,
  MemoryStick,
  Activity,
  BookOpen,
  FileText,
  Globe,
  Folder,
  Settings,
  Play,
  Shield,
  XCircle,
  ArrowUpDown,
} from 'lucide-react'

const BASE_PROCESSES = [
  { name: 'eduos-kernel', user: 'system', cpu: 0.4, ram: 28, icon: Shield, priority: 'Fondo', color: 'text-slate-500' },
  { name: 'explorer-ui', user: 'estudiante', cpu: 2.1, ram: 96, icon: Folder, priority: 'Normal', color: 'text-blue-400' },
  { name: 'edu-browser', user: 'estudiante', cpu: 14.3, ram: 312, icon: Globe, priority: 'Foreground', color: 'text-cyan-500' },
  { name: 'libre-office', user: 'estudiante', cpu: 6.7, ram: 184, icon: FileText, priority: 'Foreground', color: 'text-green-500' },
  { name: 'pdf-reader', user: 'estudiante', cpu: 1.2, ram: 58, icon: BookOpen, priority: 'Normal', color: 'text-amber-500' },
  { name: 'settings-daemon', user: 'system', cpu: 0.3, ram: 18, icon: Settings, priority: 'Fondo', color: 'text-slate-500' },
  { name: 'zram-svc', user: 'system', cpu: 0.6, ram: 12, icon: Activity, priority: 'Fondo', color: 'text-green-500' },
  { name: 'bloat-shield', user: 'system', cpu: 0.2, ram: 8, icon: Shield, priority: 'Fondo', color: 'text-emerald-500' },
  { name: 'media-player', user: 'estudiante', cpu: 3.8, ram: 72, icon: Play, priority: 'Normal', color: 'text-violet-500' },
  { name: 'file-indexer', user: 'system', cpu: 0.9, ram: 34, icon: Folder, priority: 'Fondo', color: 'text-slate-500' },
]

export default function ProcessViewerWindow() {
  const [processes, setProcesses] = useState(BASE_PROCESSES)
  const [sortKey, setSortKey] = useState('cpu')
  const [sortDir, setSortDir] = useState('desc')
  const [killTarget, setKillTarget] = useState(null)

  useEffect(() => {
    const t = setInterval(() => {
      setProcesses((prev) =>
        prev.map((p) => ({
          ...p,
          cpu: Math.max(0.1, Math.min(99, p.cpu + (Math.random() * 6 - 3))),
          ram: Math.max(4, Math.min(800, p.ram + (Math.random() * 20 - 10))),
        }))
      )
    }, 2000)
    return () => clearInterval(t)
  }, [])

  const totalCpu = processes.reduce((a, p) => a + p.cpu, 0)
  const totalRam = processes.reduce((a, p) => a + p.ram, 0)

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sorted = [...processes].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
    return sortDir === 'asc' ? String(av).localeCompare(bv) : String(bv).localeCompare(av)
  })

  const killProcess = (name) => {
    setKillTarget(name)
    setTimeout(() => {
      setProcesses((prev) => prev.filter((p) => p.name !== name))
      setKillTarget(null)
    }, 400)
  }

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex flex-col text-xs">
      <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-800">
        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase font-semibold text-slate-500">CPU Total</span>
            <Cpu size={12} className="text-blue-500" />
          </div>
          <div className="text-lg font-bold text-blue-400">{totalCpu.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5">
            <div
              className={`h-full rounded-full ${totalCpu > 65 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(totalCpu, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase font-semibold text-slate-500">RAM Usada</span>
            <MemoryStick size={12} className="text-green-500" />
          </div>
          <div className="text-lg font-bold text-green-400">{(totalRam / 1024).toFixed(2)} GB</div>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5">
            <div
              className={`h-full rounded-full ${totalRam > 2800 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${(totalRam / 4096) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase font-semibold text-slate-500">Procesos</span>
            <Activity size={12} className="text-slate-400" />
          </div>
          <div className="text-lg font-bold text-slate-200">{processes.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {processes.filter((p) => p.priority === 'Foreground').length} activos
          </div>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] uppercase font-semibold text-slate-500">Core Pinning</span>
            <Shield size={12} className="text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-emerald-400">Activo</div>
          <div className="text-[10px] text-slate-500 mt-1">Apps Edu: Core 0-1</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 z-10">
            <tr className="text-[10px] uppercase text-slate-500 font-semibold">
              <th
                onClick={() => toggleSort('name')}
                className="text-left p-2 cursor-pointer hover:text-slate-300 select-none flex items-center gap-1"
              >
                Proceso <ArrowUpDown size={9} />
              </th>
              <th className="text-left p-2">Usuario</th>
              <th
                onClick={() => toggleSort('cpu')}
                className="text-right p-2 cursor-pointer hover:text-slate-300 select-none w-20"
              >
                CPU <ArrowUpDown size={9} className="inline" />
              </th>
              <th
                onClick={() => toggleSort('ram')}
                className="text-right p-2 cursor-pointer hover:text-slate-300 select-none w-24"
              >
                RAM <ArrowUpDown size={9} className="inline" />
              </th>
              <th className="text-center p-2 w-20">Prioridad</th>
              <th className="text-center p-2 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const Icon = p.icon
              const killing = killTarget === p.name
              const canKill = p.user !== 'system'
              return (
                <tr
                  key={p.name}
                  className={`border-b border-slate-800/60 hover:bg-slate-800/40 transition-opacity ${
                    killing ? 'opacity-40' : ''
                  }`}
                >
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded bg-slate-800 ${p.color}`}>
                        <Icon size={12} />
                      </div>
                      <span className="font-medium text-slate-200">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-2 text-slate-400">{p.user}</td>
                  <td className="p-2 text-right">
                    <span className={`font-mono font-semibold ${p.cpu > 15 ? 'text-amber-400' : 'text-blue-400'}`}>
                      {p.cpu.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-2 text-right">
                    <span className={`font-mono font-semibold ${p.ram > 250 ? 'text-amber-400' : 'text-green-400'}`}>
                      {p.ram.toFixed(0)} MB
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        p.priority === 'Foreground'
                          ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          : p.priority === 'Fondo'
                          ? 'bg-slate-800 text-slate-500'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.priority}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      disabled={!canKill}
                      onClick={() => killProcess(p.name)}
                      className={`p-1 rounded ${
                        canKill
                          ? 'hover:bg-red-500/20 text-slate-500 hover:text-red-500'
                          : 'text-slate-700 cursor-not-allowed'
                      }`}
                      title={canKill ? 'Finalizar proceso' : 'Proceso del sistema'}
                    >
                      <XCircle size={13} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
