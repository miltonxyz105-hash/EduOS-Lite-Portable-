import { useState, useEffect } from 'react'
import { Clock, Battery, Wifi, Lock, Shield, Users } from 'lucide-react'

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
    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-blue-800 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-slate-700 blur-3xl"></div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-4 text-slate-500 z-10">
        <div className="flex items-center gap-1.5">
          <Wifi size={15} className="text-blue-500" />
          <span className="text-[11px]">Wi-Fi</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Battery size={15} className="text-green-500" />
          <span className="text-[11px]">87%</span>
        </div>
      </div>

      <div className="z-10 text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
            <Shield size={28} className="text-white" />
          </div>
        </div>
        <div className="mb-2">
          <h1 className="text-7xl font-light text-white tracking-tight flex items-center justify-center gap-3">
            <Clock size={56} className="text-blue-500 opacity-60" />
            {formatTime(time)}
          </h1>
        </div>
        <p className="text-lg text-slate-500 capitalize">{formatDate(time)}</p>
      </div>

      <form onSubmit={handleSubmit} className="z-10 w-full max-w-sm">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col items-center mb-5">
            <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-blue-500/50 flex items-center justify-center mb-3 py-3 px-4">
              <Users size={28} className="text-blue-500" />
            </div>
            <h2 className="text-white font-semibold text-base">Estudiante / Docente</h2>
            <p className="text-slate-500 text-xs">EduOS Lite - GovEdu Edition</p>
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese contraseña (cualquier texto)"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Lock size={16} />
            Iniciar Sesión
          </button>

          <p className="text-center text-slate-600 text-[11px] mt-3">
            Presione Enter o haga clic para acceder
          </p>
        </div>
      </form>

      <div className="absolute bottom-6 z-10 flex items-center gap-2 text-slate-600 text-[11px]">
        <Shield size={11} className="text-blue-500/60" />
        <span>EduOS Lite - Government & Educational Edition</span>
      </div>
    </div>
  )
}
