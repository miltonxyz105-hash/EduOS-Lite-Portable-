import { useState } from 'react'
import {
  Usb,
  Cloud,
  RefreshCw,
  HardDrive,
  Folder,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Archive,
  Shield,
  Wifi,
} from 'lucide-react'

export default function USBSyncWindow() {
  const [usbPresent, setUsbPresent] = useState(true)
  const [usbCapacity] = { total: 32, used: 18 }
  const [cloudAvailable, setCloudAvailable] = useState(true)
  const [cloudCapacity] = { total: 50, used: 12.3 }
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSync, setLastSync] = useState('hace 12 min')
  const [autoBackup, setAutoBackup] = useState(true)
  const [autoCloud, setAutoCloud] = useState(true)

  const items = [
    { name: 'Tareas_Alumnos', size: '840 MB', type: 'Carpeta', onUsb: true, onCloud: true, modified: '2 min' },
    { name: 'Apuntes_Matematicas.pdf', size: '12 MB', type: 'PDF', onUsb: true, onCloud: false, modified: '1 hora' },
    { name: 'Clase_Historia.mp4', size: '340 MB', type: 'Video', onUsb: false, onCloud: true, modified: '3 horas' },
    { name: 'Trabajo_Final.docx', size: '4.2 MB', type: 'Doc', onUsb: true, onCloud: true, modified: '15 min' },
    { name: 'Backup_Sistema.img', size: '2.1 GB', type: 'Imagen', onUsb: true, onCloud: false, modified: 'ayer' },
    { name: 'Libro_Biologia.epub', size: '28 MB', type: 'Libro', onUsb: true, onCloud: true, modified: '2 días' },
  ]

  const runSync = () => {
    setSyncing(true)
    setSyncProgress(0)
    const t = setInterval(() => {
      setSyncProgress((p) => {
        if (p >= 100) {
          clearInterval(t)
          setSyncing(false)
          setLastSync('ahora')
          return 100
        }
        return Math.min(p + Math.random() * 14 + 4, 100)
      })
    }, 320)
  }

  const usbPct = (usbCapacity.used / usbCapacity.total) * 100
  const cloudPct = (cloudCapacity.used / cloudCapacity.total) * 100

  return (
    <div className="h-full bg-slate-900 text-slate-100 flex flex-col text-xs">
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-slate-800">
        <div className={`rounded-lg p-3 border ${
          usbPresent
            ? 'bg-cyan-500/8 border-cyan-500/30'
            : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Usb size={15} className={usbPresent ? 'text-cyan-500' : 'text-slate-600'} />
              <div>
                <div className="font-semibold text-white">USB Portátil</div>
                <div className="text-[10px] text-slate-500">
                  {usbPresent ? 'Conectado · E:' : 'No detectado'}
                </div>
              </div>
            </div>
            {usbPresent ? (
              <CheckCircle size={14} className="text-cyan-500" />
            ) : (
              <AlertCircle size={14} className="text-amber-500" />
            )}
          </div>
          <div className="text-[10px] text-slate-400 mb-1">
            {usbCapacity.used.toFixed(1)} GB / {usbCapacity.total} GB
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full">
            <div
              className={`h-full rounded-full ${usbPct > 85 ? 'bg-amber-500' : 'bg-cyan-500'}`}
              style={{ width: `${usbPct}%` }}
            ></div>
          </div>
        </div>

        <div className={`rounded-lg p-3 border ${
          cloudAvailable
            ? 'bg-violet-500/8 border-violet-500/30'
            : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud size={15} className={cloudAvailable ? 'text-violet-500' : 'text-slate-600'} />
              <div>
                <div className="font-semibold text-white">Almacenamiento Nube</div>
                <div className="text-[10px] text-slate-500">
                  {cloudAvailable ? 'Disponible' : 'Sin internet'}
                </div>
              </div>
            </div>
            <Wifi size={14} className={cloudAvailable ? 'text-violet-500' : 'text-slate-600'} />
          </div>
          <div className="text-[10px] text-slate-400 mb-1">
            {cloudCapacity.used} GB / {cloudCapacity.total} GB
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full">
            <div
              className={`h-full rounded-full ${cloudPct > 85 ? 'bg-amber-500' : 'bg-violet-500'}`}
              style={{ width: `${cloudPct}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 px-3 py-2.5 border-b border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[9px] uppercase text-slate-500 font-semibold">
            <Clock size={10} /> Última Sincro
          </div>
          <div className="text-[11px] font-medium text-slate-200">{lastSync}</div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[9px] uppercase text-slate-500 font-semibold">
            <Archive size={10} /> Elementos
          </div>
          <div className="text-[11px] font-medium text-slate-200">{items.length}</div>
        </div>
        <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950/60 border border-slate-800">
          <button
            onClick={() => setAutoBackup(!autoBackup)}
            className={`px-2 py-1 rounded text-[10px] font-medium flex-1 ${
              autoBackup ? 'bg-cyan-500/15 text-cyan-400' : 'text-slate-500'
            }`}
          >
            Auto USB
          </button>
          <button
            onClick={() => setAutoCloud(!autoCloud)}
            className={`px-2 py-1 rounded text-[10px] font-medium flex-1 ${
              autoCloud ? 'bg-violet-500/15 text-violet-400' : 'text-slate-500'
            }`}
          >
            Auto Nube
          </button>
        </div>
        <button
          onClick={runSync}
          disabled={syncing || !usbPresent}
          className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          <span className="text-[11px]">{syncing ? 'Sincronizando' : 'Sincronizar'}</span>
        </button>
      </div>

      {syncing && (
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-300">Sincronizando USB ↔ Nube...</span>
            <span className="text-[11px] font-mono font-semibold text-cyan-400">
              {syncProgress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
              style={{ width: `${syncProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider px-3 pt-3 pb-1.5">
          Estado de Sincronización
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-[9px] uppercase text-slate-600 font-semibold border-b border-slate-800">
              <th className="text-left px-3 py-1.5">Elemento</th>
              <th className="text-left px-3 py-1.5">Tamaño</th>
              <th className="text-center px-3 py-1.5 w-14">USB</th>
              <th className="text-center px-3 py-1.5 w-14">Nube</th>
              <th className="text-right px-3 py-1.5">Modif.</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-slate-800 text-slate-400">
                      <Folder size={12} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">{it.name}</div>
                      <div className="text-[9px] text-slate-500">{it.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-[11px] text-slate-400">{it.size}</td>
                <td className="px-3 py-2 text-center">
                  {it.onUsb ? (
                    <CheckCircle size={14} className="text-cyan-500 mx-auto" />
                  ) : (
                    <HardDrive size={14} className="text-slate-700 mx-auto" />
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {it.onCloud ? (
                    <CheckCircle size={14} className="text-violet-500 mx-auto" />
                  ) : (
                    <Cloud size={14} className="text-slate-700 mx-auto" />
                  )}
                </td>
                <td className="px-3 py-2 text-right text-[10px] text-slate-500">
                  hace {it.modified}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
        <Shield size={13} className="text-emerald-500" />
        <span className="text-[10px] text-slate-400">
          Modo Pocket-PC activo: Plug-and-play con cifrado AES-256. Respaldo incremental automático al conectar USB.
        </span>
      </div>
    </div>
  )
}
