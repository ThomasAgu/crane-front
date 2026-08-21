'use client'

import { TaskDto } from '@/lib/dto/TaskDto';
import styles from './groups.module.css';

interface TaskGridProps {
  tasks: TaskDto[];
  onDelete?: (id: number) => void;
}

export default function TaskGrid({ tasks, onDelete }: TaskGridProps) {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay tareas disponibles aún.</p>
      </div>
    );
  }

  return (
    <div className={styles.groupGrid}>
      {tasks.map((task) => (
        <div key={task.id} className={styles.groupCard}>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{task.name}</h3>
            <p className={styles.cardDescription}>{task.description}</p>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className={styles.deleteButton}
              title="Eliminar tarea"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
