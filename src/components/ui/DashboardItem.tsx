'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AppDto } from '@/src/lib/dto/AppDto'
import styles from './DashboardItem.module.css'
import { restartApp, startApp, stopApp } from '@/src/lib/api/AppService'
import { Play, Pause, Plus, Minus, RefreshCcw, Trash, Layers2 } from 'lucide-react'

interface DashboardItemProps {
  app: AppDto
}

export default function DashboardItem({ app }: DashboardItemProps) {
  const router = useRouter()
  const [active, setActive] = useState(app.status != 'Stopped');
  
  const handleClickItem = () => {
    router.push(`/home/${app.id}/`)
  }


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

  const handleRestartApp = async () => {
    try {
      setActive(false)
      const data = await restartApp(String(app.id));
      setActive(true);
    } catch (err: any) {
      window.alert('huno un error al arrancar el servicio');      
    }
  }

  return (
    <div onClick={handleClickItem}
      className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm border border-gray-200 
                 hover:shadow-md transition-all hover:border-blue-400 flex flex-col justify-start gap-2 h-90 w-80"
    >
      <div className={`${styles.header}`}>
        <div className="flex justify-between w-full items-center">
          <h2 className={styles.title}>{app.name}</h2>
          <div
            className={`${styles.state} ${
              active ? styles.active : styles.inactive
            }`}
          >
            {active ? 'Activo' : 'Inactivo'}
          </div>
        </div>
      </div>

      <div className={styles.actionButtons}>
          {active ? (
            <>
              <button onClick={handleStopApp} className={styles.pauseButton}><Pause size={30} /></button>
              <button onClick={handleRestartApp} className={styles.restartButton} ><RefreshCcw size={30}/> </button>
              <button onClick={handleRestartApp} className={styles.scaleButton} ><Layers2 size={30}/> </button>
            </>
          ) : (
            <>
              <button onClick={handleStartApp} className={styles.playButton}><Play size={30} /> </button>
            </>
          )}

          <button onClick={handleStopApp} className={styles.deleteButton}><Trash size={30} /></button>
        </div>


      {/* Cobtar servicios reglas redes etc  */}
      <div className="flex flex-col gap-1 mb-4 text-sm text-gray-600">
        <p>Escala actual: {app.current_scale ?? 'N/A'}</p>
        <p>
          Creado:{' '}
          {app.created_at
            ? new Date(app.created_at).toLocaleDateString()
            : 'Desconocido'}
        </p>
      </div>
    </div>
  )
}
