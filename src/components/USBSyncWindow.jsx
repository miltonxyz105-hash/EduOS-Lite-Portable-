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
  Shield,
  Wifi,
  FileText,
  Film,
  BookOpen,
  Disc,
} from 'lucide-react'

const SYNC_TABLE = [
  {
    name: 'Tareas_Alumnos',
    size: '840 MB',
    type: 'Carpeta',
    onUsb: true,
    onCloud: true,
    modified: '2 min',
    icon: Folder,
    iconColor: 'text-emerald-500',
  },
  {
    name: 'Apuntes_Matematicas.pdf',
    size: '12 MB',
    type: 'PDF',
    onUsb: true,
    onCloud: false,
    modified: '1 hora',
    icon: FileText,
    iconColor: 'text-red-500',
  },
  {
    name: 'Clase_Historia.mp4',
    size: '340 MB',
    type: 'Video',
    onUsb: false,
    onCloud: true,
    modified: '3 horas',
    icon: Film,
    iconColor: 'text-violet-500',
  },
  {
    name: 'Trabajo_Final.docx',
    size: '4.2 MB',
    type: 'Documento',
    onUsb: true,
    onCloud: true,
    modified: '15 min',
    icon: FileText,
    iconColor: 'text-blue-500',
  },
  {
    name: 'Backup_Sistema.img',
    size: '2.1 GB',
    type: 'Imagen Disco',
    onUsb: true,
    onCloud: false,
    modified: 'ayer',
    icon: Disc,
    iconColor: 'text-amber-500',
  },
  {
    name: 'Libro_Biologia.epub',
    size: '28 MB',
    type: 'Libro Digital',
    onUsb: true,
    onCloud: true,
    modified: '2 días',
    icon: BookOpen,
    iconColor: 'text-green-500',
  },
]

export default function USBSyncWindow() {
  const [usbPresent, setUsbPresent] = useState(true)
  const [cloudAvailable, setCloudAvailable] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSync, setLastSync] = useState('hace 12 min')
  const [autoBackup, setAutoBackup] = useState(true)
  const [autoCloud, setAutoCloud] = useState(true)

  const usbTotal = 32
  const usbUsed = 18
  const cloudTotal = 50
  const cloudUsed = 12.3
  const usbPct = (usbUsed / usbTotal) * 100
  const cloudPct = (cloudUsed / cloudTotal) * 100

  const runSync = () => {
    if (syncing || !usbPresent) return
    setSyncing(true)
    setSyncProgress(0)
    const timer = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setSyncing(false)
          setLastSync('ahora')
          return 100
        }
        return Math.min(prev + Math.random() * 14 + 4, 100)
      })
    }, 320)
  }

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col text-xs">
      <div className="grid grid-cols-2 gap-2 p-3 border-b border-slate-800">
        <div
          className={
            usbPresent
              ? 'rounded-lg p-3 border bg-cyan-500/8 border-cyan-500/30'
              : 'rounded-lg p-3 border bg-slate-950/60 border-slate-800'
          }
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Usb size={15} className={usbPresent ? 'text-cyan-500' : 'text-slate-600'} />
              <div>
                <div className="font-semibold text-white text-[12px]">USB Portátil</div>
                <div className="text-[10px] text-slate-500">
                  {usbPresent ? 'Conectado · (E:)' : 'No detectado'}
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
            {usbUsed.toFixed(1)} GB / {usbTotal} GB
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full">
            <div
              className={
                usbPct > 85
                  ? 'h-full bg-amber-500 rounded-full'
                  : 'h-full bg-cyan-500 rounded-full'
              }
              style={{ width: `${usbPct}%` }}
            ></div>
          </div>
        </div>

        <div
          className={
            cloudAvailable
              ? 'rounded-lg p-3 border bg-violet-500/8 border-violet-500/30'
              : 'rounded-lg p-3 border bg-slate-950/60 border-slate-800'
          }
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cloud size={15} className={cloudAvailable ? 'text-violet-500' : 'text-slate-600'} />
              <div>
                <div className="font-semibold text-white text-[12px]">Almacenamiento Nube</div>
                <div className="text-[10px] text-slate-500">
                  {cloudAvailable ? 'Disponible' : 'Sin internet'}
                </div>
              </div>
            </div>
            <Wifi size={14} className={cloudAvailable ? 'text-violet-500' : 'text-slate-600'} />
          </div>
          <div className="text-[10px] text-slate-400 mb-1">
            {cloudUsed} GB / {cloudTotal} GB
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full">
            <div
              className={
                cloudPct > 85
                  ? 'h-full bg-amber-500 rounded-full'
                  : 'h-full bg-violet-500 rounded-full'
              }
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
            <Folder size={10} /> Elementos
          </div>
          <div className="text-[11px] font-medium text-slate-200">{SYNC_TABLE.length}</div>
        </div>
        <div className="flex items-center gap-1 p-1.5 rounded bg-slate-950/60 border border-slate-800">
          <button
            type="button"
            onClick={() => setAutoBackup((p) => !p)}
            className={
              autoBackup
                ? 'px-2 py-1 rounded text-[10px] font-medium flex-1 bg-cyan-500/15 text-cyan-400'
                : 'px-2 py-1 rounded text-[10px] font-medium flex-1 text-slate-500'
            }
          >
            Auto USB
          </button>
          <button
            type="button"
            onClick={() => setAutoCloud((p) => !p)}
            className={
              autoCloud
                ? 'px-2 py-1 rounded text-[10px] font-medium flex-1 bg-violet-500/15 text-violet-400'
                : 'px-2 py-1 rounded text-[10px] font-medium flex-1 text-slate-500'
            }
          >
            Auto Nube
          </button>
        </div>
        <button
          type="button"
          onClick={runSync}
          disabled={syncing || !usbPresent}
          className={
            'px-3 py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 ' +
            (syncing || !usbPresent
              ? 'bg-slate-700'
              : 'bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500')
          }
        >
          {syncing ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
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
        <table className="w-full border-collapse">
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
            {SYNC_TABLE.map((it, idx) => {
              const IconTag = it.icon
              return (
                <tr
                  key={idx}
                  className="border-b border-slate-800/60 hover:bg-slate-800/40"
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className={'p-1.5 rounded bg-slate-800 ' + it.iconColor}>
                        <IconTag size={12} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{it.name}</div>
                        <div className="text-[9px] text-slate-500">{it.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-400">
                    {it.size}
                  </td>
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
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
        <Shield size={13} className="text-emerald-500 flex-shrink-0" />
        <span className="text-[10px] text-slate-400 leading-snug">
          Modo Pocket-PC activo: Plug-and-play con cifrado AES-256. Respaldo incremental
          automático al conectar USB.
        </span>
      </div>
    </div>
  )
}
