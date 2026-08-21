'use client'

import { useEffect, useState } from 'react';
import { TaskDto, TaskGroupCreateDto, TaskDetailsDto } from '@/lib/dto/TaskDto';
import { TaskService } from '@/lib/api/taskService';
import { Plus, Trash2, Calendar } from 'lucide-react';
import DeleteModal from '@/components/ui/DeleteModal';
import styles from './GroupDetail.module.css';
import { RequirePermission } from '../layout/RequirePermission';
import { useUserId } from "@/hooks/useUserId";

interface GroupTaskManagerProps {
  groupId: number;
  options: TaskDto[];
  groupTasks: TaskDetailsDto[];
  onTaskAssigned?: () => void;
  onTaskUnassigned?: () => void;
}

export default function GroupTaskManager({
  groupId,
  options = [],
  groupTasks = [],
  onTaskAssigned,
  onTaskUnassigned,
}: GroupTaskManagerProps) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [deliverDate, setDeliverDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState<TaskDetailsDto | null>(null);

  // Obtener la fecha de hoy en formato local YYYY-MM-DD libre de desfases UTC
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedTaskId) {
      setError('Por favor, selecciona una tarea');
      return;
    }

    if (!publishDate || !deliverDate) {
      setError('Ambas fechas son obligatorias para la asignación');
      return;
    }

    if (publishDate < todayStr) {
      setError('La fecha de publicación no puede ser menor al día de hoy');
      return;
    }

    if (deliverDate < todayStr) {
      setError('La fecha de entrega no puede ser menor al día de hoy');
      return;
    }

    if (publishDate > deliverDate) {
      setError('La fecha de publicación no puede ser superior a la fecha de entrega');
      return;
    }

    setIsLoading(true);

    try {
      const data: TaskGroupCreateDto = {
        task_id: Number(selectedTaskId),
        group_id: groupId,
        publish_date: new Date(publishDate).toISOString(),
        deliver_date: new Date(deliverDate).toISOString(),
      };

      await TaskService.assignTaskToGroup(data);
      setShowAssignForm(false);
      setSelectedTaskId('');
      setPublishDate('');
      setDeliverDate('');
      onTaskAssigned?.();
    } catch (err) {
      setError('Error al asignar la tarea');
      console.error('Error assigning task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassignTask = async (taskId: number) => {
    const taskToDelete = groupTasks.find(t => t.id === taskId);
    setSelectedTaskToDelete(taskToDelete || null);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTaskToDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      TaskService.removeTaskFromGroup(selectedTaskToDelete.id);
      setShowDeleteModal(false);
      setSelectedTaskToDelete(null);
      onTaskUnassigned?.();
    } catch (err) {
      setError('Error al desasignar la tarea');
      console.error('Error unassigning task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para formatear de forma amigable las fechas que vienen de la API
  const formatDate = (dateInput: Date | string) => {
    if (!dateInput) return '-';
    const date = new Date(dateInput);
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const shouldShowTask = (task: any) => {
    const publishTime = new Date(task.publish_date + 'Z').getTime();
    const currentTime = Date.now();
    return task.task.created_by === useUserId() || publishTime <= currentTime
  }

  return (
    <div className={styles.taskManagerSection}>
      <div className={styles.taskManagerHeader}>
        <h2>Tareas del Grupo</h2>
        <RequirePermission object="TASKS" action="POST">      
          <button
            onClick={() => setShowAssignForm(!showAssignForm)}
            className={styles.assignTaskButton}
            disabled={isLoading}
          >
            <Plus size={18} />
            Asignar Tarea
          </button>
        </RequirePermission>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {showAssignForm && (
        <form onSubmit={handleAssignTask} className={styles.assignTaskForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="taskSelect">Seleccionar Tarea</label>
              {/* 2. Selector UX friendly usando las options */}
              <select
                id="taskSelect"
                value={selectedTaskId}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  setError(null);
                }}
                disabled={isLoading}
                required
                className={styles.selectInput}
              >
                <option value="">-- Elige una tarea de la lista --</option>
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} (ID: {option.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="publishDate">Fecha de Publicación</label>
              <input
                id="publishDate"
                type="date"
                min={todayStr} // Restringe a nivel nativo en el calendario
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deliverDate">Fecha de Entrega / Cierre</label>
              <input
                id="deliverDate"
                type="date"
                min={publishDate || todayStr} // Evita nativamente que sea menor a la de publicación
                value={deliverDate}
                onChange={(e) => setDeliverDate(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => {
                setShowAssignForm(false);
                setSelectedTaskId('');
                setPublishDate('');
                setDeliverDate('');
                setError(null);
              }}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading || !selectedTaskId}
            >
              {isLoading ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </form>
      )}

      <div className={styles.taskList}>
        {groupTasks.length === 0 ? (
        <p className={styles.emptyMessage}>No hay tareas asignadas a este grupo</p>
      ) : (
        groupTasks.map((task: TaskDetailsDto) => (
          shouldShowTask(task) && (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskContent}>
                <h4>{task.task?.name || "Tarea sin nombre"}</h4>
                <p>{task.task?.description || "Sin descripción disponible"}</p>
                          
                <div className={styles.taskDates}>
                  <span>
                    <Calendar size={14} /> Publicación: {formatDate(task.publish_date)}
                  </span>
                  <span>
                    <Calendar size={14} /> Cierre: {formatDate(task.deliver_date)}
                  </span>
                </div>
              </div>
              <RequirePermission object="TASKS" action="POST">    
                <button
                  onClick={() => handleUnassignTask(task.id)}
                  className={styles.unassignButton}
                  disabled={isLoading}
                  title="Desasignar tarea"
                >
                  <Trash2 size={18} />
                </button>
              </RequirePermission>
            </div>
          )
        ))
      )}
      </div>

      {showDeleteModal && selectedTaskToDelete && (
        <DeleteModal
          itemName={selectedTaskToDelete.task?.name || 'Tarea sin nombre'}
          itemType="tareas del grupo"
          deleteFunction={handleConfirmDelete}
          setActive={setShowDeleteModal}
        />
      )}
    </div>
  );
}