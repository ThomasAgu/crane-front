'use client'

import { useState } from 'react';
import { TaskCreateDto } from '@/lib/dto/TaskDto';
import { X } from 'lucide-react';
import styles from '../groups/groups.module.css';
import InputText from '../forms/InputText';
import { requiredValidator } from '@/lib/validators/RequiredValidator';

export interface TaskFormData {
  name: string;
  description: string;
}

export class TaskFormController {
  data: TaskFormData;
  errors: Record<string, string | null> = {};

  constructor(initial?: TaskFormData) {
    this.data = {
      name: initial?.name || '',
      description: initial?.description || '',
    };
  }

  update<K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) {
    this.data = { ...this.data, [key]: value } as TaskFormData;
    this.errors[key] = null;
    return this.data;
  }

  validate(): boolean {
    this.errors = {};

    if (!this.data.name?.trim()) {
      this.errors.name = 'El nombre de la tarea es requerido';
    }

    if (!this.data.description?.trim()) {
      this.errors.description = 'La descripción es requerida';
    }

    return Object.keys(this.errors).length === 0;
  }

  toTaskCreateDto(): TaskCreateDto {
    return {
      name: this.data.name,
      description: this.data.description,
    };
  }

  static fromTaskDto(dto: TaskCreateDto): TaskFormData {
    return {
      name: dto.name,
      description: dto.description,
    };
  }
}

interface TaskFormProps {
  onSubmit: (data: TaskCreateDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TaskForm({ onSubmit, onCancel, isLoading = false }: TaskFormProps) {
  const [formController] = useState(() => {
    return new TaskFormController();
  });

  const [state, setState] = useState<TaskFormData>(formController.data);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    formController.update(key, value);
    setState({ ...formController.data });
    setErrors({ ...errors, [key]: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formController.validate()) {
      setErrors({ ...formController.errors });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formController.toTaskCreateDto());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.formOverlay} onClick={handleBackdropClick}>
      <div className={styles.formModal}>
        <div className={styles.formHeader}>
          <h2>Nueva Tarea</h2>
          <button
            type="button"
            onClick={onCancel}
            className={styles.closeButton}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <InputText 
              label="Nombre de la tarea"
              type='text'
              placeholder='Nombre de la tarea'
              value={state.name}
              setValue={(v) => update('name', v)}
              submitValidators={[requiredValidator]}
              setShowError={() => {}}
            />
            {errors.name && (
              <span className={styles.error}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Descripción (puede ser un link a un documento)</label>
            <textarea
              id="description"
              name="description"
              className="text-darkest"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe la tarea o pega un link a un documento..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}