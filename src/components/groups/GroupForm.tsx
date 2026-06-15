'use client'

import { useState } from 'react';
import { GroupCreateDto } from '@/lib/dto/GroupDto';
import { UserDataDto } from '@/lib/dto/UserDto';
import { X } from 'lucide-react';
import styles from './groups.module.css';
import InputText from '../forms/InputText';
import UserInviteInput from '../forms/UserInviteInput';
import { requiredValidator } from '@/lib/validators/RequiredValidator';

export interface GroupFormData {
  name: string;
  description: string;
  selectedUsers: UserDataDto[];
}

export class GroupFormController {
  data: GroupFormData;
  errors: Record<string, string | null> = {};

  constructor(initial?: GroupFormData) {
    this.data = {
      name: initial?.name || '',
      description: initial?.description || '',
      selectedUsers: initial?.selectedUsers || [],
    };
  }

  update<K extends keyof GroupFormData>(key: K, value: GroupFormData[K]) {
    this.data = { ...this.data, [key]: value } as GroupFormData;
    this.errors[key] = null;
    return this.data;
  }

  validate(): boolean {
    this.errors = {};

    if (!this.data.name?.trim()) {
      this.errors.name = 'El nombre del grupo es requerido';
    }

    if (!this.data.description?.trim()) {
      this.errors.description = 'La descripción es requerida';
    }

    return Object.keys(this.errors).length === 0;
  }

  toGroupCreateDto(): GroupCreateDto {
    return {
      name: this.data.name,
      description: this.data.description,
      member_ids: this.data.selectedUsers.map(u => u.id),
    };
  }

  static fromGroupDto(dto: GroupCreateDto): GroupFormData {
    return {
      name: dto.name,
      description: dto.description,
      selectedUsers: [],
    };
  }
}

interface GroupFormProps {
  onSubmit: (data: GroupCreateDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function GroupForm({ onSubmit, onCancel, isLoading = false }: GroupFormProps) {
  const [formController] = useState(() => {
    return new GroupFormController();
  });

  const [state, setState] = useState<GroupFormData>(formController.data);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <K extends keyof GroupFormData>(key: K, value: GroupFormData[K]) => {
    formController.update(key, value);
    setState({ ...formController.data });
    setErrors({ ...errors, [key]: null });
  };

  const handleAddUser = (user: UserDataDto) => {
    const updatedUsers = [...state.selectedUsers, user];
    update('selectedUsers', updatedUsers);
  };

  const handleRemoveUser = (userId: number) => {
    const updatedUsers = state.selectedUsers.filter(u => u.id !== userId);
    update('selectedUsers', updatedUsers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formController.validate()) {
      setErrors({ ...formController.errors });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formController.toGroupCreateDto());
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
          <h2>Nuevo Grupo</h2>
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
              label="Nombre del grupo"
              type='text'
              placeholder='Grupo nombre xyz'
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
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              className="text-darkest"
              value={state.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe el propósito del grupo..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <span className={styles.error}>{errors.description}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <UserInviteInput
              selectedUsers={state.selectedUsers}
              onAddUser={handleAddUser}
              onRemoveUser={handleRemoveUser}
              label="Agregar usuarios"
              placeholder="Busca por nombre o email..."
            />
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
              {isSubmitting || isLoading ? 'Creando...' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
