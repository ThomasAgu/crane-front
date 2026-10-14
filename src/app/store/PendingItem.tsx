import React, { useState } from 'react';
import { Check, X, Calendar, LayoutTemplate, AppWindow, ArrowRight, Clock3 } from 'lucide-react';
import type { onHoldRepositoryDto } from '@/lib/dto/RepositoryDto';
import styles from './store.module.css';
import RepositoryRejectionForm from '@/components/forms/RepositoryRejectionForm';

interface PendingItemProps {
  item: onHoldRepositoryDto;
  onApprove: (id: number) => void;
  onReject: (id: number, message: string) => Promise<void>;
  onViewDetails: (id: number) => void;
}

export const PendingItem: React.FC<PendingItemProps> = ({ item, onApprove, onReject, onViewDetails }) => {
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const isTemplate = item.is_template ?? false;

  const handleReject = async (message: string) => {
    setRejecting(true);
    try {
      await onReject(item.id, message);
      setShowRejectionForm(false);
    } finally {
      setRejecting(false);
    }
  };
  
  const formatDate = (d?: string | Date) => 
    d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '---';

  return (
    <div className={`${styles.modernCard} ${styles.cardPendingBorder}`}>
      <div className={styles.cardBody}>
        <div className={styles.pendingCardHeader}>
          <div className={styles.pendingCardHeading}>
            <p className={styles.pendingCardEyebrow}>Solicitud de publicación</p>
            <h3 className={styles.cardTitle}>{item.name}</h3>
          </div>
          <span className={styles.pendingStatusBadge}>
            <Clock3 size={13} />
            Pendiente
          </span>
        </div>

        <p className={styles.cardDescription}>{item.description}</p>

        <div className={styles.pendingMetadata}>
          <span className={styles.metadataItem}>
            <Calendar size={14} />
            <span>Propuesto el {formatDate(item.created_at)}</span>
          </span>
          <span className={`${styles.pendingTypeBadge} ${isTemplate ? styles.pendingTemplate : styles.pendingApp}`}>
            {isTemplate ? <LayoutTemplate size={14} /> : <AppWindow size={14} />}
            {isTemplate ? 'Plantilla' : 'Aplicación'}
          </span>
        </div>
      </div>

      <div className={styles.modernFooterPending}>
        <button type="button" onClick={() => onViewDetails(item.id)} className={styles.detailsButton}>
          <span>Ver detalle</span>
          <ArrowRight size={15} />
        </button>
        <div className={styles.pendingActions}>
          <button type="button" onClick={() => setShowRejectionForm(true)} className={styles.actionRejectBtn}>
            <X size={15} /> Rechazar
          </button>
          <button type="button" onClick={() => onApprove(item.id)} className={styles.actionApproveBtn}>
            <Check size={15} /> Aprobar
          </button>
        </div>
      </div>
      {showRejectionForm && (
        <RepositoryRejectionForm
          repositoryName={item.name}
          onSubmit={handleReject}
          onCancel={() => setShowRejectionForm(false)}
          isLoading={rejecting}
        />
      )}
    </div>
  );
};