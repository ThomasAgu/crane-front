'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react'
import { ActionService } from '@/lib/api/actionService'
import { AlertService } from '@/lib/api/alertService'
import { editorService } from '@/app/services/EditorService'
import AlertForm, { AlertFormData } from '@/components/forms/AlertForm'
import { AlertDto, AlertCreateDto } from '@/lib/dto/AlertDto'
import { ActionDto } from '@/lib/dto/ActionDto'
import DeleteModal from '@/components/ui/DeleteModal'
import { useAlert, AlertSnackbar } from '@/components/ui/AlertSnackbar'
import styles from './AlertEditor.module.css'

interface AlertEditorProps {
  appId?: number | null;
  selectedApp?: { alerts?: AlertDto[] } | null;
}

type FormMode = 'create' | 'edit' | null

const AlertEditor: React.FC<AlertEditorProps> = ({ appId, selectedApp }) => {
  const [alerts, setAlerts] = useState<(AlertDto | AlertCreateDto)[]>([])
  const [actions, setActions] = useState<ActionDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [currentAlert, setCurrentAlert] = useState<AlertFormData | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ active: boolean; index: number | null }>({
    active: false,
    index: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { alertState, showAlert, handleCloseAlert } = useAlert()

  useEffect(() => {
    fetchActions()
  }, [])

  useEffect(() => {
    const existingAlerts = editorService.getAlerts()
    if (existingAlerts.length > 0) {
      setAlerts(existingAlerts)
      return
    }

    if (appId) {
      loadAlertsFromBackend()
      return
    }

    if (selectedApp?.alerts && selectedApp.alerts.length > 0) {
      setAlerts(selectedApp.alerts)
      editorService.setAlerts(selectedApp.alerts)
    }
  }, [appId, selectedApp])

  useEffect(() => {
    editorService.setAlerts(alerts)
  }, [alerts])

  const fetchActions = async () => {
    try {
      const data = await ActionService.get_all()
      setActions(data)
    } catch (err) {
      console.error('Error fetching actions:', err)
    }
  }

  const loadAlertsFromBackend = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await AlertService.getAlertsForApp(String(appId))
      setAlerts(data)
    } catch (err) {
      console.error('Error loading alerts:', err)
      setError('No se pudieron cargar las alertas desde el backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    setEditingIndex(null)
    setCurrentAlert({
      alert: '',
      expr: '',
      for_time: '5m',
      severity: 'critical',
      summary: '',
      description: '',
      firing_action: '',
      resolved_action: '',
    })
    setFormMode('create')
  }

  const handleEditClick = (index: number) => {
    const alert = alerts[index]
    setEditingIndex(index)
    setCurrentAlert({
      alert: alert.alert,
      expr: alert.expr,
      for_time: String(alert.for_time),
      severity: alert.severity,
      summary: alert.summary,
      description: alert.description,
      firing_action: alert.firing_action,
      resolved_action: alert.resolved_action,
    })
    setFormMode('edit')
  }

  const handleFormCancel = () => {
    setFormMode(null)
    setEditingIndex(null)
    setCurrentAlert(null)
  }

  const handleFormSubmit = async (formData: AlertFormData) => {
    setIsSubmitting(true)
    try {
      const updatedAlerts = [...alerts]
      if (formMode === 'create') {
        updatedAlerts.push({ ...formData })
        showAlert('La alerta se ha agregado al editor.', 'success', 'Alerta creada')
      } else if (formMode === 'edit' && editingIndex !== null) {
        updatedAlerts[editingIndex] = { ...updatedAlerts[editingIndex], ...formData }
        showAlert('La alerta se ha actualizado en el editor.', 'info', 'Alerta actualizada')
      }

      setAlerts(updatedAlerts)
      setFormMode(null)
      setEditingIndex(null)
      setCurrentAlert(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la alerta')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (index: number) => {
    setDeleteModal({ active: true, index })
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.index === null) return
    const newAlerts = alerts.filter((_, idx) => idx !== deleteModal.index)
    setAlerts(newAlerts)
    setDeleteModal({ active: false, index: null })
    showAlert('Alerta eliminada del editor.', 'error', 'Alerta borrada')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Alertas</h2>
          <p className={styles.subtitle}>
            Define reglas de alerta antes de crear la aplicación. Las alertas se enviarán con la creación del app.
          </p>
        </div>
        <button className={styles.addButton} onClick={handleCreateClick} disabled={isSubmitting}>
          <Plus size={18} />
          Añadir alerta
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className={styles.closeError} onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {formMode && currentAlert && (
        <div className={styles.formOverlay}>
          <div className={styles.formWrapper}>
            <AlertForm
              initialData={currentAlert}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
              isEditing={formMode === 'edit'}
              actions={actions}
            />
          </div>
        </div>
      )}

      <div className={styles.alertsContainer}>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader size={32} className={styles.spinner} />
            <p>Cargando alertas...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} />
            <h3>No hay alertas definidas</h3>
            <p>Añade una alerta para que el backend la reciba cuando crees la aplicación.</p>
            <button className={styles.emptyStateButton} onClick={handleCreateClick}>
              <Plus size={16} />
              Crear alerta
            </button>
          </div>
        ) : (
          <div className={styles.alertsList}>
            {alerts.map((alert, index) => (
              <div key={`${alert.alert}-${index}`} className={styles.alertCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.titleSection}>
                    <h3 className={styles.alertTitle}>{alert.alert}</h3>
                    <span className={`${styles.severityBadge} ${styles[`severity-${alert.severity}`]}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.editButton} onClick={() => handleEditClick(index)}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.deleteButton} onClick={() => handleDeleteClick(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Expresión</label>
                    <code className={styles.expression}>{alert.expr}</code>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Resumen</label>
                    <p className={styles.description}>{alert.summary}</p>
                  </div>

                  <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <label className={styles.fieldLabel}>Duración</label>
                      <span className={styles.metaValue}>{String(alert.for_time)}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <label className={styles.fieldLabel}>Acción al activarse</label>
                      <span className={styles.metaValue}>{alert.firing_action || 'Ninguna'}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <label className={styles.fieldLabel}>Acción al resolverse</label>
                      <span className={styles.metaValue}>{alert.resolved_action || 'Ninguna'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModal.active && deleteModal.index !== null && (
        <DeleteModal
          itemName={alerts[deleteModal.index]?.alert || 'alerta'}
          itemType="alertas"
          deleteFunction={handleConfirmDelete}
          setActive={(active: boolean) => {
            if (!active) setDeleteModal({ active: false, index: null })
          }}
        />
      )}

      <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
    </div>
  )
}

export default AlertEditor;
