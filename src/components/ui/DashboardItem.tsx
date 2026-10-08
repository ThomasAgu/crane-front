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
  LayoutTemplate,
  FlaskConical,
  AppWindow,
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
  const repositoryUpdatedAtText = app?.repository_updated_at
    ? new Date(app.repository_updated_at).toLocaleDateString()
    : "—";
  const router = useRouter();
  const [active, setActive] = useState(app.status !== 'Stopped');
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const isTemplate = app.is_template ?? false;
  const repositoryPending = app.repository_state === 'pending';

  const REPOSITORY_STATUS_MAP = {
    pending: { label: 'Pendiente de aprobación', className: style.repositoryPending },
    approved: { label: 'Publicado', className: style.repositoryApproved },
    rejected: { label: 'Rechazado', className: style.repositoryRejected },
  } as const;

  const repositoryState = app.repository_state as keyof typeof REPOSITORY_STATUS_MAP | undefined;

  const currentStatus = repositoryState && repositoryState in REPOSITORY_STATUS_MAP
    ? REPOSITORY_STATUS_MAP[repositoryState]
    : {
        label: 'No publicado',
        className: style.repositoryNotPublished,
      };

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

  const handleLaboratoryClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    stopClick(e)
    router.push(`/laboratory?appId=${app.id}`)
  }

  const handleUploadSubmit = async (formData: RepositoryFormData) => {
    setLoading(true);
    setUploadModal(false);
    const repositoryData = {
      name: formData.name,
      description: formData.description,
      services: app.services?.map(s => s.image).join(", ") || "",
      app_id: app.id,
      user_id: app.user_id,
      is_template: app.is_template ?? false,
      is_uploaded: app.is_uploaded
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
      
      onUpdate();
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "Ocurrió un error al intentar procesar la solicitud.",
        "error",
        "No se pudo procesar la solicitud"
      );
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
      className={`${style.card} ${isTemplate ? style.templateCard : ''}`}
    >
      <div className={style.cardHeader}>
        <div className={style.projectIdentity}>
          <span className={`${style.projectIcon} ${isTemplate ? style.templateIcon : style.applicationIcon}`}>
            {isTemplate ? <LayoutTemplate size={21} /> : <AppWindow size={21} />}
          </span>
          <div className={style.projectHeading}>
            <h2 className={style.title}>{app.name}</h2>
            <span className={`${style.typeBadge} ${isTemplate ? style.templateBadge : style.applicationBadge}`}>
              {isTemplate ? 'Plantilla' : 'Aplicación'}
            </span>
          </div>
        </div>

        <span className={`${style.state} ${active ? style.active : style.inactive}`}>
          <span className={style.stateDot} />
          {active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <dl className={style.metadata}>
        <div className={style.metadataItem}>
          <dt>Escala actual</dt>
          <dd>{app.current_scale}</dd>
        </div>
        <div className={style.metadataItem}>
          <dt>Creado</dt>
          <dd>{createdAtText}</dd>
        </div>
        <div className={style.metadataItem}>
          <dt>Actualización del repositorio</dt>
          <dd>{repositoryUpdatedAtText}</dd>
        </div>
        <div className={style.metadataItem}>
          <dt>Estado del repositorio</dt>
          <dd className={currentStatus.className}>{currentStatus.label}</dd>
        </div>
      </dl>

      <div className={style.actions}>
        {!isTemplate && (
          active ? (
            <>
              <button
                onClick={handleStop}
                className="p-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer transition"
              >
                <Pause size={20} />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-green-100  text-green-700 hover:bg-green-200 cursor-pointer transition"
              >
                <RefreshCcw size={20} />
              </button>

              <button
                onClick={handleScale}
                className="p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 cursor-pointer transition"
              >
                <Layers2 size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={handleStart}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition"
            >
              <Play size={20} />
            </button>
          )
        )}

        <button
          onClick={handleLaboratoryClick}
          className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer transition"
          title="Abrir en el laboratorio"
          aria-label="Abrir en el laboratorio"
        >
          <FlaskConical size={20} />
        </button>

        <button
          onClick={handleUploadClick}
          disabled={repositoryPending || loading}
          className={`p-2 rounded-lg transition ${
            repositoryPending
              ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
              : app.is_uploaded 
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
              : 'bg-blue-100 text-gray-700 hover:bg-blue-200 cursor-pointer' 
          }`}
          title={repositoryPending
            ? "Solicitud pendiente de aprobación"
            : app.is_uploaded ? "Actualizar datos en repositorio" : "Subir al repositorio"}
        >
          <UploadCloud size={20} />
        </button>

        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer transition ml-auto"
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