import { useState, useEffect } from 'react'
import { Clock, Battery, Wifi, Lock, Power } from 'lucide-react'

export default function LockScreen({ onUnlock }) {
  const [time, setTime] = useState(new Date())
  const [password, setPassword] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) =>
    date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

  const formatDate = (date) =>
    date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    onUnlock()
  }

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-red-600 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-red-800 blur-3xl"></div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-4 text-gray-500 z-10">
        <div className="flex items-center gap-1.5">
          <Wifi size={16} className="text-red-500" />
          <span className="text-xs">Wi-Fi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Battery size={16} className="text-red-500" />
          <span className="text-xs">87%</span>
        </div>
      </div>

      <div className="z-10 text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center shadow-neon-red">
            <Power size={32} className="text-white" />
          </div>
        </div>
        <div className="mb-2">
          <h1 className="text-8xl font-light text-white tracking-tight flex items-center justify-center gap-3">
            <Clock size={64} className="text-red-500 opacity-70" />
            {formatTime(time)}
          </h1>
        </div>
        <p className="text-xl text-gray-500 capitalize">{formatDate(time)}</p>
      </div>

      <form onSubmit={handleSubmit} className="z-10 w-full max-w-sm">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-black border-2 border-red-500/60 flex items-center justify-center mb-3">
              <Lock size={32} className="text-red-500" />
            </div>
            <h2 className="text-white font-semibold text-lg">Usuario Gamer</h2>
            <p className="text-gray-500 text-sm">HyperX OS v1.0</p>
          </div>

          <div className="mb-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña (cualquier texto)"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold rounded-xl transition-all shadow-neon-red flex items-center justify-center gap-2"
          >
            <Power size={18} />
            Iniciar Sesión
          </button>

          <p className="text-center text-gray-600 text-xs mt-4">
            Presiona Enter o haz clic para acceder
          </p>
        </div>
      </form>

      <div className="absolute bottom-6 z-10 flex items-center gap-2 text-gray-600 text-xs">
        <Power size={12} className="text-red-500/60" />
        <span>HyperX OS - Black & Red Edition</span>
      </div>
    </div>
  )
}
