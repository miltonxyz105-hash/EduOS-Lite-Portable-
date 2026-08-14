import { useState } from 'react'
import {
  Settings,
  Zap,
  Monitor,
  Shield,
  Info,
  ToggleLeft,
  ToggleRight,
  Cpu,
  HardDrive,
  MemoryStick,
  Check,
  RefreshCw,
  Gauge,
  Sparkles,
} from 'lucide-react'

export default function SettingsWindow() {
  const [boostActive, setBoostActive] = useState(true)
  const [savingBoost, setSavingBoost] = useState(false)
  const [lowResourceMode, setLowResourceMode] = useState(true)
  const [animations, setAnimations] = useState(false)
  const [activeTab, setActiveTab] = useState('system')

  const handleBoostToggle = () => {
    setSavingBoost(true)
    setTimeout(() => {
      setBoostActive((prev) => !prev)
      setSavingBoost(false)
    }, 400)
  }

  return (
    <div className="flex h-full bg-gray-900 text-gray-100 font-sans select-none">
      {/* Sidebar de Navegación */}
      <div className="w-52 bg-gray-950 border-r border-gray-800 p-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">
          <Settings size={16} />
          Configuración OS
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'system'
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          }`}
        >
          <Zap size={15} />
          Rendimiento & Gaming
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hardware')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'hardware'
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          }`}
        >
          <Cpu size={15} />
          Información del Equipo
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'about'
              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
              : 'text-gray-400 hover:bg-gray-900 hover:text-white'
          }`}
        >
          <Info size={15} />
          Acerca del OS
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === 'system' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Optimización Extreme</h2>
              <p className="text-xs text-gray-400">Ajustes diseñados para maximizar los FPS y reducir el uso de memoria.</p>
            </div>

            {/* Modo Ultra Bajo Consumo */}
            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
                  <Gauge size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Modo RAM Ahorro Extremo</h3>
                  <p className="text-[11px] text-gray-400">Mantiene el uso de RAM por debajo de 300 MB libres para juegos.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBoostToggle}
                disabled={savingBoost}
                className="text-red-500 hover:text-red-400 transition-colors cursor-pointer"
              >
                {savingBoost ? (
                  <RefreshCw size={26} className="animate-spin text-red-500" />
                ) : boostActive ? (
                  <ToggleRight size={30} className="text-red-500" />
                ) : (
                  <ToggleLeft size={30} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Desactivar Efectos Visuales */}
            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white">Animaciones de Interfaz</h3>
                  <p className="text-[11px] text-gray-400">Desactiva efectos visuales para liberar ciclos de procesador (CPU).</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnimations((prev) => !prev)}
                className="cursor-pointer"
              >
                {animations ? (
                  <ToggleRight size={30} className="text-red-500" />
                ) : (
                  <ToggleLeft size={30} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Estado en tiempo real simulado */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-950/40 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <MemoryStick size={18} className="text-green-400" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Consumo de RAM</div>
                  <div className="text-xs font-semibold text-green-400">210 MB / 4 GB (Optimo)</div>
                </div>
              </div>

              <div className="bg-gray-950/40 border border-gray-800 rounded-xl p-3 flex items-center gap-3">
                <Cpu size={18} className="text-green-400" />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Uso de CPU en Reposo</div>
                  <div className="text-xs font-semibold text-green-400">1.2 %</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hardware' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Especificaciones Detectadas</h2>
              <p className="text-xs text-gray-400">Configuración de hardware analizada para optimización.</p>
            </div>

            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Procesador</span>
                <span className="text-white font-medium">Intel Celeron / Dual-Core Low Power</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Memoria RAM Instalada</span>
                <span className="text-white font-medium">4 GB DDR3 / DDR4</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Gráficos</span>
                <span className="text-white font-medium">Intel HD Graphics (Ultra Low Profile)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Almacenamiento</span>
                <span className="text-white font-medium">120 GB SSD / eMMC</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white mb-1">HyperX Lite OS</h2>
              <p className="text-xs text-gray-400">Edición Especial para Netbooks & PCs de Bajos Recursos.</p>
            </div>

            <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Edición</span>
                <span className="text-red-400 font-semibold">HyperX OS - LowSpec Gaming</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Perfil</span>
                <span className="text-gray-200">Netbooks del Gobierno / PC Escolar</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Estado del Kernel</span>
                <span className="text-green-400 flex items-center gap-1 font-medium">
                  <Check size={14} /> Ultra Optimizado (Zero Lag)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}