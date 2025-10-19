'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AppDto } from '@/src/lib/dto/AppDto'
import styles from './DashboardItem.module.css'
import { startApp, stopApp } from '@/src/lib/api/AppService'
import { Play, Pause, Plus, Minus } from 'lucide-react'

interface DashboardItemProps {
  app: AppDto
}

export default function DashboardItem({ app }: DashboardItemProps) {
  const router = useRouter()
  const [active, setActive] = useState(app.status != 'Stopped');
  const canScaleUp = (app.current_scale ?? 0) < (app.max_scale ?? 0)
  const canScaleDown = (app.current_scale ?? 0) > (app.min_scale ?? 0)

  //ME falta saber en que estado esta
  const handleStartApp = async () => {
    try {
      const data = await startApp(String(app.id));
      setActive(true);
    } catch (err: any) {
      window.alert('huno un error al arrancar el servicio');
    }
  }

  const handleStopApp = async () => {
    try {
      const data = await stopApp(String(app.id));
      setActive(false)
    } catch (err: any) {
      window.alert('huno un error al arrancar el servicio');      
    }
  }

  return (
    <div
      className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm border border-gray-200 
                 hover:shadow-md transition-all hover:border-blue-400 flex flex-col justify-between"
    >
      <div className={`${styles.header} mb-3`}>
        <div className="flex justify-between w-full items-center">
          <h2 className="text-lg font-semibold text-gray-800">{app.name}</h2>
          <div
            className={`${styles.state} ${
              active ? styles.active : styles.inactive
            }`}
          >
            {active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
        <p>Escala actual: {app.current_scale ?? 'N/A'}</p>
        <p>
          Creado:{' '}
          {app.created_at
            ? new Date(app.created_at).toLocaleDateString()
            : 'Desconocido'}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <button
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white 
                     ${active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                     transition`}
        >
          {active ? (
            <>
              <button onClick={handleStopApp}><Pause size={16} /> Pausar</button>
            </>
          ) : (
            <>
              <button onClick={handleStartApp}><Play size={16} /> Pausar</button>
            </>
          )}
        </button>

        {/* Escalar controles */}
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition 
                       ${!canScaleDown ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={!canScaleDown}
          >
            <Minus size={16} />
          </button>
          <button
            className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition 
                       ${!canScaleUp ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={!canScaleUp}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
