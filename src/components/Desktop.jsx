import { Folder, Settings, Trash2, BookOpen, Activity, Search, ShieldCheck, Usb, Globe } from 'lucide-react'

const desktopIcons = [
  { id: 'files', name: 'Explorador de Archivos', icon: Folder, color: 'text-blue-500' },
  { id: 'browser', name: 'EduBrowser', icon: Globe, color: 'text-blue-500' },
  { id: 'launcher', name: 'Lanzador de Apps', icon: Search, color: 'text-blue-400' },
  { id: 'cleaner', name: 'Limpiar Sistema', icon: Activity, color: 'text-green-500' },
  { id: 'processes', name: 'Procesos', icon: Activity, color: 'text-blue-500' },
  { id: 'study', name: 'Modo Estudio', icon: BookOpen, color: 'text-emerald-500' },
  { id: 'usbsync', name: 'Respaldo USB', icon: Usb, color: 'text-cyan-500' },
  { id: 'settings', name: 'Configuración', icon: Settings, color: 'text-blue-400' },
  { id: 'trash', name: 'Papelera', icon: Trash2, color: 'text-gray-400' },
]

export default function Desktop({ onOpenWindow, studyModeActive }) {
  return (
    <div className="absolute inset-0 pb-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-blue-900 blur-[100px] -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-slate-800 blur-[100px] translate-x-1/4 translate-y-1/4"></div>
        </div>
      </div>

      <div className="relative z-10 p-5 grid grid-cols-1 gap-1 w-44">
        {desktopIcons.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onOpenWindow(item.id)}
              onDoubleClick={() => onOpenWindow(item.id)}
              className="group flex flex-col items-center justify-center p-2.5 rounded-lg hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20 w-32 cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-1.5 ${item.color}`}
              >
                <Icon size={24} />
              </div>
              <span className="text-slate-200 text-[11px] text-center leading-tight">
                {item.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-16 right-5 z-10">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-3 w-52">
          <div className="flex items-center gap-2 mb-2.5">
            <div className={`w-2 h-2 rounded-full ${studyModeActive ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
            <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              EduOS Lite
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Perfil</span>
              <span className="text-blue-400 font-semibold">Educacional</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Modo</span>
              <span className={`font-semibold ${studyModeActive ? 'text-emerald-500' : 'text-slate-300'}`}>
                {studyModeActive ? 'Estudio' : 'Estándar'}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Edición</span>
              <span className="text-blue-400 font-semibold">GovEdu v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
