'use client'

import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from './RepositoryRejectionForm.module.css';

interface RepositoryRejectionFormProps {
  repositoryName: string;
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RepositoryRejectionForm({
  repositoryName,
  onSubmit,
  onCancel,
  isLoading = false,
}: RepositoryRejectionFormProps) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reason = message.trim();
    if (!reason || submitting || isLoading) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(reason);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No se pudo enviar el rechazo. Inténtalo nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const form = (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget && !submitting && !isLoading) onCancel();
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rejection-title"
        aria-describedby="rejection-description"
      >
        <header className={styles.header}>
          <div>
            <h2 id="rejection-title">Rechazar repositorio</h2>
            <p id="rejection-description">{repositoryName}</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            disabled={submitting || isLoading}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="rejection-reason">Motivo del rechazo</label>
          <textarea
            id="rejection-reason"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Explica qué debe corregirse antes de aprobar la publicación."
            rows={4}
            required
            minLength={1}
            maxLength={2000}
            disabled={submitting || isLoading}
            autoFocus
          />
          {submitError && <p className={styles.error} role="alert">{submitError}</p>}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={submitting || isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!message.trim() || submitting || isLoading}
            >
              {submitting || isLoading ? 'Enviando...' : 'Rechazar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );

  return typeof document === 'undefined' ? null : createPortal(form, document.body);
}
