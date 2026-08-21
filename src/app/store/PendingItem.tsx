import React from 'react';
import { Check, X, Calendar, LayoutTemplate, AppWindow, ArrowRight } from 'lucide-react';
import { onHoldRepositoryDto } from '@/lib/dto/RepositoryDto';
import styles from './store.module.css';

interface PendingItemProps {
  item: onHoldRepositoryDto;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export const PendingItem: React.FC<PendingItemProps> = ({ item, onApprove, onReject, onViewDetails }) => {
  const isTemplate = item.is_template ?? false;
  
  const formatDate = (d?: string | Date) => 
    d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '---';

  return (
    <div className={`${styles.modernCard} ${styles.cardPendingBorder}`}>
      <div className={styles.cardBody}>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className={styles.cardTitle}>{item.name}</h3>
          <span className={`${styles.badge} ${styles.badgeAmber}`}>
            Pendiente
          </span>
        </div>

        <p className={styles.cardDescription}>{item.description}</p>

        <div className={styles.metadataContainer}>
          <span className={styles.metadataItem}>
            <Calendar size={12} /> Propuesto: {formatDate(item.created_at)}
          </span>
          <span className={`${styles.badgeLineal} ${isTemplate ? styles.txtPurple : styles.txtBlue}`}>
            {isTemplate ? <LayoutTemplate size={12} /> : <AppWindow size={12} />}
            {isTemplate ? 'Template' : 'App'}
          </span>
        </div>
      </div>

      <div className={styles.modernFooterPending}>
        <button onClick={() => onViewDetails(item.id)} className={styles.detailsButton}>
          <span>Ver detalle</span>
          <ArrowRight size={15} />
        </button>
        <button onClick={() => onReject(item.id)} className={styles.actionRejectBtn}>
          <X size={15} /> Rechazar
        </button>
        <button onClick={() => onApprove(item.id)} className={styles.actionApproveBtn}>
          <Check size={15} /> Aprobar
        </button>
      </div>
    </div>
  );
};