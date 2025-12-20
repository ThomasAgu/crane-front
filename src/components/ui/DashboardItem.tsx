'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AppDto } from '@/src/lib/dto/AppDto'
import { useAlert, AlertSnackbar } from './AlertSnackbar'
import {
  Play,
  Pause,
  RefreshCcw,
  Trash,
  Layers2,
} from 'lucide-react'
import { AppService } from '@/src/lib/api/appService'
import DeleteModal from './DeleteModal'
import Loader from './Loader'
import style from './DashboardItem.module.css'

interface DashboardItemProps {
  app: AppDto
  onUpdate: CallableFunction
}

export default function DashboardItem({ app, onUpdate }: DashboardItemProps) {
  const createdAtText = app?.created_at ? new Date(app.created_at).toLocaleDateString() : "—";
  const router = useRouter();
  const [active, setActive] = useState(app.status !== 'Stopped');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { alertState, showAlert, handleCloseAlert } = useAlert();
  
  const stopClick = (e: any) => e.stopPropagation()

  const handleStart = async (e: any) => {
    stopClick(e)
    setLoading(true)
    await AppService.start(String(app.id))
    setActive(true)
    onUpdate()
    showAlert(
      "La aplicación ha sido iniciada.",
      "success",
      "Aplicación Iniciada"
    );
    setLoading(false)
  }

  const handleStop = async (e: any) => {
    stopClick(e)
    setLoading(true);
    await AppService.stop(String(app.id))
    setActive(false)
    onUpdate()
    showAlert(
      "La aplicación ha sido detenida.",
      "success",
      "Aplicación Detenida"
    );
    setLoading(false);
  }

  const handleRestart = async (e: any) => {
    stopClick(e)
    setLoading(true);
    await AppService.restart(String(app.id))
    setActive(true)
    onUpdate();
    showAlert(
      "La aplicación ha sido reiniciada.",
      "success",
      "Aplicación Reiniciada"
    );
    setLoading(false);
  }

  const handleScale = async (e: any) => {
    stopClick(e)
    setLoading(true)
    await AppService.scale(String(app.id))
    onUpdate()
    showAlert(
      "La aplicación ha sido escalada.",
      "success",
      "Aplicación Escalada"
    );
    setLoading(false)
  }

  const handleDelete = (e: any) => {
    stopClick(e)
    setDeleteModal(true);
  }

  const handleConfirmDelete = async () => {
    await AppService.delete(String(app.id))
    setDeleteModal(false)
    onUpdate()
  }

  return (
    <div
      onClick={() => router.push(`/home/${app.id}/?status=${app.status}`)}
      className="
        bg-white rounded-2xl border border-gray-200 shadow-sm
        hover:shadow-md hover:border-blue-300
        transition-all cursor-pointer p-5 flex flex-col gap-4
        relative
      "
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-medium text-gray-800">
          {app.name}
        </h2>

        <span
          className={`
            px-3 py-0.5 rounded-full text-xs font-semibold 
            ${active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}
          `}
        >
          {active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-1">
        <p>Escala actual: {app.current_scale}</p>
        <p>Creado: {createdAtText}</p>
      </div>

      <div className="mt-auto flex gap-3 pt-2">
        {active ? (
          <>
            <button
              onClick={handleStop}
              className="p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
            >
              <Pause size={20} />
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-green-100  text-green-700 hover:bg-green-200 transition"
            >
              <RefreshCcw size={20} />
            </button>

            <button
              onClick={handleScale}
              className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
            >
              <Layers2 size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={handleStart}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            <Play size={20} />
          </button>
        )}

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition ml-auto"
        >
          <Trash size={20} />
        </button>
      </div>
      
      <div>

      </div>
      {loading && (
        <>
            <div className={style.customLoader}>
                <Loader loading={loading} width={20} height={20}/>
            </div>

            <div className={style.loadingOverlay} /> 
        </>
      )}
 
      {deleteModal && (
        <DeleteModal
          itemName={app.name}
          itemType="aplicación"
          deleteFunction={handleConfirmDelete}
          setActive={setDeleteModal}
        />
      )}

      <AlertSnackbar
        alertState={alertState}
        handleCloseAlert={handleCloseAlert}
      />
    </div>
  )
}
