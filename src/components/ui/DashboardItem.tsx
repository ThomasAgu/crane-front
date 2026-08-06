'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { AppDto } from '@/lib/dto/AppDto'
import { useAlert, AlertSnackbar } from './AlertSnackbar'
import {
  Play,
  Pause,
  RefreshCcw,
  Trash,
  Layers2,
  UploadCloud,
  LayoutTemplate
} from 'lucide-react'
import { AppService } from '@/lib/api/appService'
import { RepositoryService } from '@/lib/api/repositoryService'
import DeleteModal from './DeleteModal'
import RepositoryForm, {RepositoryFormData} from '../forms/RepositoryForm'
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
  const [uploadModal, setUploadModal] = useState(false);
  const isTemplate = app.is_template ?? false;

  const { alertState, showAlert, handleCloseAlert } = useAlert();
  
  const stopClick = (e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()

  const handleStart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setLoading(true)
    await AppService.start(String(app.id))
    setActive(true)
    onUpdate()
    showAlert("La aplicación ha sido iniciada.", "success", "Aplicación Iniciada");
    setLoading(false)
  }

  const handleStop = async (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setLoading(true);
    await AppService.stop(String(app.id))
    setActive(false)
    onUpdate()
    showAlert("La aplicación ha sido detenida.", "success", "Aplicación Detenida");
    setLoading(false);
  }

  const handleRestart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setLoading(true);
    await AppService.restart(String(app.id))
    setActive(true)
    onUpdate();
    showAlert("La aplicación ha sido reiniciada.", "success", "Aplicación Reiniciada");
    setLoading(false);
  }

  const handleScale = async (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setLoading(true)
    await AppService.scale(String(app.id))
    onUpdate()
    showAlert("La aplicación ha sido escalada.", "success", "Aplicación Escalada");
    setLoading(false)
  }

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setDeleteModal(true);
  }

  const handleUploadClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    setUploadModal(true);
  }

  const handleUploadSubmit = async (formData: RepositoryFormData) => {
    setLoading(true);
    setUploadModal(false);
    console.log(app);
    debugger
    const repositoryData = {
      name: formData.name,
      description: formData.description,
      services: app.services?.map(s => s.image).join(", ") || "",
      app_id: app.id,
      user_id: app.user_id,
      is_template: app.is_template ?? false,
      is_uploaded: false
    };

    try {
      if (!app.is_uploaded) {
        await RepositoryService.createRepository(repositoryData);
        showAlert(
          "Se ha creado una petición para subir tu aplicación al repositorio. El equipo de Crane revisará tu solicitud.",
          "success",
          "Aplicación Subida al Repositorio"
        );
      } else {
        await RepositoryService.updateRepository(repositoryData);
        showAlert(
          "Los datos de tu aplicación en el repositorio se han actualizado correctamente.",
          "success",
          "Repositorio Actualizado"
        );
      }
      
      onUpdate(); // Refresca los datos del dashboard para capturar el nuevo estado `is_uploaded`
    } catch (error) {
      showAlert("Ocurrió un error al intentar procesar la solicitud.", "error", "Error");
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e);
    setDeleteModal(false);
    setLoading(true);

    try {
      await AppService.delete(String(app.id));
      setLoading(false);
      onUpdate();
      showAlert("La aplicación ha sido eliminada.", "success", "Aplicación Eliminada");
    } catch (error: any) {
      setLoading(false);
      showAlert(
        "La aplicación no puede eliminarse porque esta subida al repositorio.",
        "error",
        "Operación no permitida"
      );
    }
  };

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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            {app.name}
          </h2>
          {isTemplate && (
            <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
              <LayoutTemplate size={12} /> Plantilla
            </span>
          )}
        </div>

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
        {/* Indicador visual opcional del estado en el repositorio */}
        <p className="text-xs mt-1">
          Estado Repo: {app.is_uploaded ? (
            <span className="text-blue-600 font-semibold">Publicado</span>
          ) : (
            <span className="text-gray-700 font-semibold">No publicado</span>
          )}
        </p>
      </div>

      <div className="mt-auto flex gap-3 pt-2">
        {!isTemplate && (
          active ? (
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
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              <Play size={20} />
            </button>
          )
        )}

        <button
          onClick={handleUploadClick}
          className={`p-2 rounded-lg transition ${
            app.is_uploaded 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
          }`}
          title={app.is_uploaded ? "Actualizar datos en repositorio" : "Subir al repositorio"}
        >
          <UploadCloud size={20} />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition ml-auto"
        >
          <Trash size={20} />
        </button>
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

      {uploadModal && (
        <RepositoryForm
          initialData={{
            name: app.name,
            description: app.is_uploaded ? "" : `Repositorio para la aplicación ${app.name}`
          }}
          isEdit={app.is_uploaded}
          onSubmit={handleUploadSubmit}
          onCancel={() => setUploadModal(false)}
          isLoading={loading}
        />
      )}

      <AlertSnackbar
        alertState={alertState}
        handleCloseAlert={handleCloseAlert}
      />
    </div>
  )
}