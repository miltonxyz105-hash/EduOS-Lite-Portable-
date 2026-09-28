import { useState } from 'react'
import {
  Activity,
  Trash2,
  FileText,
  Image as ImageIcon,
  Download,
  Database,
  CheckCircle,
  Loader2,
  RefreshCw,
  HardDrive,
} from 'lucide-react'

export default function SystemCleanerWindow() {
  const [scanning, setScanning] = useState(false)
  const [cleaning, setCleaning] = useState(false)
  const [results, setResults] = useState(null)
  const [selected, setSelected] = useState({
    temp: true,
    cache: true,
    downloads: false,
    thumbnails: true,
    ramCache: true,
  })

  const scanItems = [
    { key: 'temp', label: 'Archivos Temporales', size: '248 MB', icon: FileText, color: 'text-amber-500' },
    { key: 'cache', label: 'Caché de Aplicaciones', size: '412 MB', icon: Database, color: 'text-blue-500' },
    { key: 'downloads', label: 'Descargas Antiguas', size: '1.2 GB', icon: Download, color: 'text-violet-500' },
    { key: 'thumbnails', label: 'Miniaturas Cache', size: '86 MB', icon: ImageIcon, color: 'text-pink-500' },
    { key: 'ramCache', label: 'RAM Cache (Flush)', size: '~380 MB', icon: Activity, color: 'text-green-500' },
  ]

  const totalSize = () => {
    const sizes = { temp: 248, cache: 412, downloads: 1228, thumbnails: 86, ramCache: 380 }
    const total = Object.keys(selected)
      .filter((k) => selected[k])
      .reduce((acc, k) => acc + sizes[k], 0)
    return total > 1024 ? `${(total / 1024).toFixed(1)} GB` : `${total} MB`
  }

  const runScan = () => {
    setScanning(true)
    setResults(null)
    setTimeout(() => {
      setScanning(false)
      setResults({ freed: totalSize(), items: 1247 })
    }, 1800)
  }

  const runClean = () => {
    setCleaning(true)
    setTimeout(() => {
      setCleaning(false)
      setResults({ freed: totalSize(), items: 1247, done: true })
    }, 2200)
  }

  return (
    <div className="h-full bg-slate-900 text-slate-100 p-4 flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity size={16} className="text-green-500" />
            Limpiador de Sistema
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Libera RAM y espacio en disco. Optimizado para equipos de bajos recursos.</p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning || cleaning}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
        >
          {scanning ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          <span className="font-medium">{scanning ? 'Analizando...' : 'Analizar'}</span>
        </button>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 space-y-2">
        {scanItems.map((item) => {
          const Icon = item.icon
          return (
            <label
              key={item.key}
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-800/60 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected[item.key]}
                onChange={(e) => setSelected({ ...selected, [item.key]: e.target.checked })}
                className="w-3.5 h-3.5 accent-blue-500 rounded border-slate-600 bg-slate-800"
              />
              <div className={`p-1.5 rounded bg-slate-800 ${item.color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-200">{item.label}</div>
              </div>
              <div className="font-mono font-semibold text-slate-400 text-[11px]">{item.size}</div>
            </label>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
          <HardDrive size={16} className="text-blue-500" />
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">A Liberar</div>
            <div className="text-sm font-bold text-blue-400">{totalSize()}</div>
          </div>
        </div>
        <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2">
          <Trash2 size={16} className="text-slate-400" />
          <div>
            <div className="text-[9px] text-slate-500 uppercase font-semibold">Elementos</div>
            <div className="text-sm font-bold text-slate-300">
              {results ? results.items : '---'}
            </div>
          </div>
        </div>
      </div>

      {results && (
        <div className={`rounded-lg p-3 flex items-center gap-2.5 border ${
          results.done
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-blue-500/10 border-blue-500/30'
        }`}>
          <CheckCircle size={18} className={results.done ? 'text-green-500' : 'text-blue-500'} />
          <div>
            <div className="font-semibold text-white">
              {results.done ? 'Limpieza completada' : 'Análisis completado'}
            </div>
            <div className={`text-[11px] ${results.done ? 'text-green-400' : 'text-blue-400'}`}>
              {results.done
                ? `Se liberaron ${results.freed} de espacio exitosamente.`
                : `${results.freed} pueden ser liberados. Haga clic en Limpiar.`}
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto pt-2">
        <button
          onClick={runClean}
          disabled={cleaning || scanning}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {cleaning ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {cleaning ? 'Limpiando sistema...' : 'Limpiar y Optimizar'}
        </button>
      </div>
    </div>
  )
}
