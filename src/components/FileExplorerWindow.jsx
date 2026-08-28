import {
  Folder,
  HardDrive,
  FileText,
  Image as ImageIcon,
  Download,
  Gamepad2,
  ChevronRight,
} from 'lucide-react'

export default function FileExplorerWindow() {
  return (
    <div className="flex h-full bg-gray-900 text-gray-100 font-sans select-none">
      {/* Sidebar de Unidades y Ubicaciones */}
      <div className="w-56 bg-gray-950 border-r border-gray-800 p-3 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1">
          Almacenamiento Local
        </div>

        {/* Disco C: Sistema Único */}
        <button
          type="button"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-red-500/10 text-red-400 border border-red-500/30"
        >
          <HardDrive size={16} className="text-red-500" />
          <div className="flex flex-col items-start leading-tight">
            <span>Disco Local (C:)</span>
            <span className="text-[10px] text-gray-500">64 GB libres de 120 GB</span>
          </div>
        </button>

        <div className="my-2 border-t border-gray-800/80"></div>

        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1">
          Accesos Rápidos
        </div>

        <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer">
          <Download size={15} className="text-gray-500" />
          Descargas
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer">
          <Gamepad2 size={15} className="text-gray-500" />
          Juegos Lite
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer">
          <FileText size={15} className="text-gray-500" />
          Documentos
        </div>
        <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-900 hover:text-white rounded-lg cursor-pointer">
          <ImageIcon size={15} className="text-gray-500" />
          Imágenes
        </div>
      </div>

      {/* Vista de Archivos y Carpetas */}
      <div className="flex-1 p-5 flex flex-col gap-4 overflow-auto">
        {/* Barra de dirección / Path */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-gray-400">
          <HardDrive size={14} className="text-red-500" />
          <span>Equipo</span>
          <ChevronRight size={12} className="text-gray-600" />
          <span className="text-white font-medium">Disco Local (C:)</span>
        </div>

        {/* Estado del almacenamiento del disco C */}
        <div className="bg-gray-950/40 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium">Capacidad de Almacenamiento SSD/eMMC</span>
            <span className="text-red-400 font-semibold">120 GB SSD</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 h-full rounded-full transition-all w-[46%]"></div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-gray-500">
            <span>56 GB Usados</span>
            <span>64 GB Libres</span>
          </div>
        </div>

        {/* Contenido simulado de carpetas */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 mb-3">Carpetas del Sistema</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-950/60 border border-gray-800 hover:border-red-500/40 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all group">
              <Folder size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-medium text-white">Juegos_Optimizados</div>
                <div className="text-[10px] text-gray-500">4 elementos</div>
              </div>
            </div>

            <div className="bg-gray-950/60 border border-gray-800 hover:border-red-500/40 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all group">
              <Folder size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-medium text-white">Programas_Escolares</div>
                <div className="text-[10px] text-gray-500">12 elementos</div>
              </div>
            </div>

            <div className="bg-gray-950/60 border border-gray-800 hover:border-red-500/40 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all group">
              <Folder size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-xs font-medium text-white">Scripts_RAM_Cleaner</div>
                <div className="text-[10px] text-gray-500">2 elementos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}