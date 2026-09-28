import {
  Folder,
  HardDrive,
  FileText,
  Image as ImageIcon,
  Download,
  BookOpen,
  ChevronRight,
  Usb,
  Cloud,
  Video,
} from 'lucide-react'

export default function FileExplorerWindow() {
  return (
    <div className="flex h-full bg-slate-900 text-slate-100 font-sans select-none text-xs">
      <div className="w-52 bg-slate-950 border-r border-slate-800 p-3 flex flex-col gap-0.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
          Almacenamiento Local
        </div>

        <button
          type="button"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors bg-blue-500/10 text-blue-400 border border-blue-500/30"
        >
          <HardDrive size={15} className="text-blue-500" />
          <div className="flex flex-col items-start leading-tight">
            <span>Disco Local (A:)</span>
            <span className="text-[10px] text-slate-500">1.2 TB libres de 2 TB</span>
          </div>
        </button>

        <button
          type="button"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-900 hover:text-white"
        >
          <Usb size={15} className="text-cyan-500" />
          <div className="flex flex-col items-start leading-tight">
            <span>USB Portátil (E:)</span>
            <span className="text-[10px] text-slate-500">14 GB libres de 32 GB</span>
          </div>
        </button>

        <div className="my-2 border-t border-slate-800/80"></div>

        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1">
          Accesos Rápidos
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <BookOpen size={14} className="text-emerald-500" />
          Material Educativo
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <FileText size={14} className="text-blue-500" />
          Documentos
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <Download size={14} className="text-slate-500" />
          Descargas
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <ImageIcon size={14} className="text-slate-500" />
          Imágenes
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <Video size={14} className="text-slate-500" />
          Videos Clases
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-slate-400 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer">
          <Cloud size={14} className="text-cyan-500" />
          Carpeta Nube
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3 overflow-auto">
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-slate-400">
          <HardDrive size={13} className="text-blue-500" />
          <span>Equipo</span>
          <ChevronRight size={11} className="text-slate-600" />
          <span className="text-white font-medium">Disco Local (A:)</span>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Capacidad del Disco</span>
            <span className="text-blue-400 font-semibold">2 TB</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-[40%]"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>800 GB Usados</span>
            <span>1.2 TB Libres</span>
          </div>
        </div>

        <div>
          <h3 className="text-slate-400 font-semibold mb-2">Carpetas del Sistema</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-emerald-500" />
              <div>
                <div className="font-medium text-white">Material_Edu</div>
                <div className="text-[10px] text-slate-500">48 elementos</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-blue-500" />
              <div>
                <div className="font-medium text-white">Tareas_Alumnos</div>
                <div className="text-[10px] text-slate-500">156 elementos</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-cyan-500" />
              <div>
                <div className="font-medium text-white">Clases_Virtuales</div>
                <div className="text-[10px] text-slate-500">27 elementos</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-amber-500" />
              <div>
                <div className="font-medium text-white">Libros_Digitales</div>
                <div className="text-[10px] text-slate-500">89 elementos</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-green-500" />
              <div>
                <div className="font-medium text-white">Respaldos_USB</div>
                <div className="text-[10px] text-slate-500">12 elementos</div>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 hover:border-blue-500/40 p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer transition-colors">
              <Folder size={22} className="text-violet-500" />
              <div>
                <div className="font-medium text-white">Herramientas_Sis</div>
                <div className="text-[10px] text-slate-500">8 elementos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
