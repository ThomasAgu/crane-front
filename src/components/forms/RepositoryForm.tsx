'use client'

import { useState } from 'react';
import { X } from 'lucide-react';
import styles from '../groups/groups.module.css'; // Asegúrate de ajustar la ruta de tus estilos

export interface RepositoryFormData {
  name: string;
  description: string;
}

export class RepositoryFormController {
  data: RepositoryFormData;
  errors: Record<string, string | null> = {};

  constructor(initial?: Partial<RepositoryFormData>) {
    this.data = {
      name: initial?.name || '',
      description: initial?.description || '',
    };
  }

  update<K extends keyof RepositoryFormData>(key: K, value: RepositoryFormData[K]) {
    this.data = { ...this.data, [key]: value };
    this.errors[key] = null;
    return this.data;
  }

  validate(): boolean {
    this.errors = {};

    if (!this.data.name?.trim()) {
      this.errors.name = 'El nombre del repositorio es requerido';
    }

    if (!this.data.description?.trim()) {
      this.errors.description = 'La descripción es requerida';
    }

    return Object.keys(this.errors).length === 0;
  }
}

interface RepositoryFormProps {
  initialData?: Partial<RepositoryFormData>;
  onSubmit: (formData: RepositoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function RepositoryForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  isEdit = false 
}: RepositoryFormProps) {
  
  const [formController] = useState(() => new RepositoryFormController(initialData));
  const [state, setState] = useState<RepositoryFormData>(formController.data);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof RepositoryFormData>(key: K, value: RepositoryFormData[K]) => {
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
      await onSubmit(state);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className={styles.formOverlay} onClick={handleBackdropClick}>
      <div className={styles.formModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.formHeader}>
          <h2>{isEdit ? 'Actualizar Repositorio' : 'Subir al Repositorio'}</h2>
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
            <label htmlFor="repo-name">Nombre del repositorio</label>
            <input 
              id="repo-name"
              type="text"
              placeholder="Ej. mi-app-produccion"
              value={state.name}
              className='text-darkest'
              onChange={(e) => update('name', e.target.value)}
              disabled={isSubmitting || isLoading}
            />
            {errors.name && (
              <span className={styles.error}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="repo-description">Descripción</label>
            <textarea
              id="repo-description"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe qué hace esta aplicación..."
              rows={4}
              className='text-darkest'
              disabled={isSubmitting || isLoading}
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
              disabled={isSubmitting || isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Subir Aplicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}