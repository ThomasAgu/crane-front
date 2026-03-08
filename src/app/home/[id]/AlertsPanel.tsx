'use client'

import { useEffect, useState } from 'react'
import { AlertDto } from '@/src/lib/dto/AlertDto'
import { ActionDto } from '@/src/lib/dto/ActionDto'
import AlertForm, { AlertFormData, AlertFormController } from '@/src/components/forms/AlertForm'
import DeleteModal from '@/src/components/ui/DeleteModal'
import { useAlert, AlertSnackbar } from '@/src/components/ui/AlertSnackbar'
import styles from './AlertsPanel.module.css'
import { Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react'
import { ActionService } from '@/src/lib/api/actionService'
import { AlertService } from '@/src/lib/api/alertService'

interface AlertsPanelProps {
  appId: string
}

type FormMode = 'create' | 'edit' | null

export default function AlertsPanel({ appId }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<AlertDto[]>([])
  const [actions, setActions] = useState<ActionDto[]>([]);
  const { alertState, showAlert, handleCloseAlert } = useAlert();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingAlert, setEditingAlert] = useState<AlertDto | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ active: boolean; alert: AlertDto | null }>({
    active: false,
    alert: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAlerts()
    fetchActions()
  }, [appId])

  const fetchActions = async () => {
    try {
      const actions = await ActionService.get_all();
      setActions(actions)
      debugger
    } catch(err) {
      console.log(err)
    }
  }

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await AlertService.getAlertsForApp(appId);
      setAlerts(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las alertas'
      setError(errorMessage)
      console.error('Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setEditingAlert(null)
    setFormMode('create')
  }

  const handleEditClick = (alert: AlertDto) => {
    setEditingAlert(alert)
    setFormMode('edit')
  }

  const handleFormCancel = () => {
    setFormMode(null)
    setEditingAlert(null)
  }

  const handleFormSubmit = async (formData: AlertFormData) => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (formMode === 'create') {
        await AlertService.create(appId, formData)
      } else if (formMode === 'edit' && editingAlert) {
        const payload = new AlertFormController(formData)
        await AlertService.update(appId, editingAlert.id, payload)
      }
      await fetchAlerts()
      setFormMode(null)
      setEditingAlert(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la alerta'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
      if (formMode === 'create') {
        showAlert(
          "La alerta ha sido creada exitosamente.",
          "success",
          "Creada"
      );
      } else {
        showAlert(
          "La alerta ha sido actualizada exitosamente.",
          "info",
          "Actualizada"
        );  
     
      
      }
    }
  }

  const handleDeleteClick = (alert: AlertDto) => {
    setDeleteModal({ active: true, alert })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.alert) return

    try {
      setError(null)
      await AlertService.deleteAlert(appId, deleteModal.alert.id)
      setAlerts(alerts.filter((a) => a.id !== deleteModal.alert?.id))
      setDeleteModal({ active: false, alert: null })
      showAlert(
        "La alerta ha sido borrada exitosamente.",
        "error",
        "Borrada"
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la alerta'
      setError(errorMessage)
      console.error('Error deleting alert:', err)
      setDeleteModal({ active: false, alert: null })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Alertas</h2>
        <button className={styles.addButton} onClick={handleCreateClick} disabled={isSubmitting}>
          <Plus size={18} />
          Nueva Alerta
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button
            className={styles.closeError}
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {formMode && (
        <div className={styles.formOverlay}>
          <div className={styles.formWrapper}>
            <AlertForm
              initialData={editingAlert || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
              isEditing={formMode === 'edit'}
              actions={actions}
            />
          </div>
        </div>
      )}

      {deleteModal.active && deleteModal.alert && (
        <DeleteModal
          itemName={deleteModal.alert.alert}
          itemType="alertas"
          deleteFunction={handleConfirmDelete}
          setActive={(active: boolean) => {
            if (!active) {
              setDeleteModal({ active: false, alert: null })
            }
          }}
        />
      )}

      <div className={styles.alertsContainer}>
        {loading && (
          <div className={styles.loaderContainer}>
            <Loader size={32} className={styles.spinner} />
            <p>Cargando alertas...</p>
          </div>
        )}

        {!loading && alerts.length === 0 && (
          <div className={styles.emptyState}>
            <AlertCircle size={48} />
            <h3>No hay alertas</h3>
            <p>Crea tu primera alerta para monitorizar esta aplicación</p>
            <button className={styles.emptyStateButton} onClick={handleCreateClick}>
              <Plus size={16} />
              Crear Alerta
            </button>
          </div>
        )}

        {!loading && alerts.length > 0 && (
          <div className={styles.alertsList}>
            {alerts.map((alert) => (
              <div key={alert.id} className={styles.alertCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleSection}>
                    <h3 className={styles.alertTitle}>{alert.alert}</h3>
                    <span className={`${styles.severityBadge} ${styles[`severity-${alert.severity}`]}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(alert)}
                      title="Editar alerta"
                      disabled={isSubmitting}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(alert)}
                      title="Eliminar alerta"
                      disabled={isSubmitting}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Expresión:</label>
                    <code className={styles.expression}>{alert.expr}</code>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Descripción:</label>
                    <p className={styles.description}>{alert.description || 'Sin descripción'}</p>
                  </div>

                  <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <label className={styles.fieldLabel}>Duración:</label>
                      <span className={styles.metaValue}>
                        {typeof alert.for_time === 'number'
                          ? `${alert.for_time}s`
                          : alert.for_time}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <label className={styles.fieldLabel}>Severidad:</label>
                      <span className={styles.metaValue}>{alert.severity}</span>
                    </div>
                    {alert.firing_action && (
                      <div className={styles.metaItem}>
                        <label className={styles.fieldLabel}>Acción (Activación):</label>
                        <span className={styles.metaValue}>{alert.firing_action}</span>
                      </div>
                    )}
                    {alert.resolved_action && (
                      <div className={styles.metaItem}>
                        <label className={styles.fieldLabel}>Acción (Resolución):</label>
                        <span className={styles.metaValue}>{alert.resolved_action}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertSnackbar
            alertState={alertState}
            handleCloseAlert={handleCloseAlert}
        />
    </div>
  )
}
