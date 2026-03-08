'use client'

import { useEffect, useState } from 'react';
import { AlertDto } from '@/src/lib/dto/AlertDto';
import { ActionDto } from '@/src/lib/dto/ActionDto';
import PrometheusExpressionEditor from './PrometheusExpressionEditor';
import InputText from './InputText';
import { requiredValidator } from '@/src/lib/validators/RequiredValidator';
import styles from './AlertForm.module.css';
import { X } from 'lucide-react';

export interface AlertFormData {
  alert: string;
  expr: string;
  for_time: string;
  severity: string;
  summary: string;
  description: string;
  firing_action: string;
  resolved_action: string;
}

export class AlertFormController {
  data: AlertFormData;
  errors: Record<string, string | null> = {};

  constructor(initial?: AlertFormData) {
    this.data = {
      alert: initial?.alert|| '',
      expr: initial?.expr || '',
      for_time: initial?.for_time || '5m',
      severity: initial?.severity || 'critical',
      summary: initial?.summary || '',
      description: initial?.description || '',
      firing_action: initial?.firing_action || '',
      resolved_action: initial?.resolved_action || '',
    };
  }

  update<K extends keyof AlertFormData>(key: K, value: AlertFormData[K]) {
    this.data = { ...this.data, [key]: value } as AlertFormData;
    this.errors[key] = null;
    return this.data;
  }

  validate(): boolean {
    this.errors = {};

    if (!this.data.alert?.trim()) {
      this.errors.alert = 'El nombre de la alerta es requerido';
    }
    if (!this.data.expr?.trim()) {
      this.errors.expr = 'La expresión es requerida';
    }
    if (!this.data.for_time?.trim()) {
      this.errors.for_time = 'El tiempo es requerido';
    }
    if (!this.data.summary?.trim()) {
      this.errors.summary = 'El resumen es requerido';
    }

    return Object.keys(this.errors).length === 0;
  }

  static fromAlertDto(dto: AlertDto): AlertFormData {
    return {
      alert: dto.alert,
      expr: dto.expr,
      for_time: dto.for_time.toString(),
      severity: dto.severity,
      summary: dto.summary,
      description: dto.description,
      firing_action: dto.firing_action,
      resolved_action: dto.resolved_action,
    };
  }
}

interface AlertFormProps {
  initialData?: AlertDto;
  onSubmit: (data: AlertFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  actions: ActionDto[]
}

const SEVERITY_OPTIONS = [
  { value: 'critical', label: 'Crítica' },
  { value: 'warning', label: 'Advertencia' },
  { value: 'info', label: 'Información' },
];

const ALERT_ACTION_OPTIONS = [
  { value: '', label: 'Ninguna' },
  { value: 'notify', label: 'Notificar' },
  { value: 'restart', label: 'Reiniciar servicio' },
  { value: 'stop', label: 'Detener servicio' },
  { value: 'scale', label: 'Escalar aplicación' },
  { value: 'rollback', label: 'Revertir cambios' },
];

const FOR_TIME_OPTIONS = [
  { value: '1m', label: '1 minuto' },
  { value: '5m', label: '5 minutos' },
  { value: '10m', label: '10 minutos' },
  { value: '15m', label: '15 minutos' },
  { value: '30m', label: '30 minutos' },
  { value: '1h', label: '1 hora' },
];

export default function AlertForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
  actions
}: AlertFormProps) {
  const [formController] = useState(() => {
    const data = initialData ? AlertFormController.fromAlertDto(initialData) : undefined;
    return new AlertFormController(data);
  });

  const [state, setState] = useState<AlertFormData>(formController.data);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customForTime, setCustomForTime] = useState(
    !FOR_TIME_OPTIONS.some((opt) => opt.value === formController.data.for_time)
      ? formController.data.for_time
      : ''
  );

  useEffect(() => {
    if (initialData) {
      const formData = AlertFormController.fromAlertDto(initialData);
      formController.data = formData;
      setState(formData);
    }
  }, [initialData, formController]);

  const update = <K extends keyof AlertFormData>(key: K, value: AlertFormData[K]) => {
    formController.update(key, value);
    setState({ ...formController.data });
    setErrors({ ...errors, [key]: null });
  };

  const handleForTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      update('for_time', customForTime || '5m');
    } else {
      update('for_time', value);
      setCustomForTime('');
    }
  };

  const handleCustomForTimeChange = (value: string) => {
    setCustomForTime(value);
    update('for_time', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formController.validate()) {
      setErrors({ ...formController.errors });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formController.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isForTimeCustom = !FOR_TIME_OPTIONS.some((opt) => opt.value === state.for_time);

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {isEditing ? 'Editar Alerta' : 'Crear Nueva Alerta'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className={styles.closeButton}
          disabled={isSubmitting}
        >
          <X size={20} />
        </button>
      </div>

      <div className={styles.formContent}>
        {/* Alert Name */}
        <div className={styles.fieldGroup}>
          <InputText
            label="Nombre de la Alerta"
            type="text"
            placeholder="ej: stop_app, high_cpu_usage"
            value={state.alert}
            setValue={(v) => update('alert', v)}
            submitValidators={[requiredValidator]}
            setShowError={() => {}}
          />
          {errors.alert && <span className={styles.errorText}>{errors.alert}</span>}
        </div>

        {/* Prometheus Expression */}
        <div className={styles.fieldGroup}>
          <PrometheusExpressionEditor
            value={state.expr}
            onChange={(v) => update('expr', v)}
            placeholder="ej: up == 0 o rate(requests_total[5m]) > 100"
          />
          {errors.expr && <span className={styles.errorText}>{errors.expr}</span>}
        </div>

        {/* For Time */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Duración (For Time)</label>
          <div className={styles.forTimeWrapper}>
            <select
              value={isForTimeCustom ? 'custom' : state.for_time}
              onChange={handleForTimeChange}
              className={styles.select}
            >
              {FOR_TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="custom">Personalizado</option>
            </select>

            {isForTimeCustom && (
              <input
                type="text"
                value={customForTime}
                onChange={(e) => handleCustomForTimeChange(e.target.value)}
                placeholder="ej: 2m, 30s, 1h"
                className={styles.customInput}
              />
            )}
          </div>
          {errors.for_time && <span className={styles.errorText}>{errors.for_time}</span>}
        </div>

        {/* Severity */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Severidad</label>
          <select
            value={state.severity}
            onChange={(e) => update('severity', e.target.value)}
            className={styles.select}
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className={styles.fieldGroup}>
          <InputText
            label="Resumen"
            type="text"
            placeholder="ej: La aplicación no está disponible"
            value={state.summary}
            setValue={(v) => update('summary', v)}
            submitValidators={[requiredValidator]}
            setShowError={() => {}}
          />
          {errors.summary && <span className={styles.errorText}>{errors.summary}</span>}
        </div>

        {/* Description */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Descripción</label>
          <textarea
            value={state.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Descripción detallada de la alerta (opcional)"
            className={styles.textarea}
            rows={3}
            maxLength={500}
          />
          <span className={styles.charCount}>
            {state.description.length}/500
          </span>
        </div>

        {/* Firing Action */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Acción al Activarse</label>
          <select
            value={state.firing_action}
            onChange={(e) => update('firing_action', e.target.value)}
            className={styles.select}
          >
            {actions.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.description}
              </option>
            ))}
          </select>
          <small className={styles.fieldHelper}>Acción ejecutada cuando la alerta se activa</small>
        </div>

        {/* Resolved Action */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Acción al Resolverse</label>
          <select
            value={state.resolved_action}
            onChange={(e) => update('resolved_action', e.target.value)}
            className={styles.select}
          >
            {actions.map((opt) => (
              <option key={opt.name} value={opt.name}>
                {opt.description}
              </option>
            ))}
          </select>
          <small className={styles.fieldHelper}>Acción ejecutada cuando la alerta se resuelve</small>
        </div>
      </div>

      <div className={styles.formFooter}>
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
          {isSubmitting || isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
