import React from 'react';
import styles from './store.module.css';
import { ArrowUp, ArrowDown, Star, Download, LayoutTemplate, AppWindow, Calendar, RefreshCw, ArrowRight } from 'lucide-react';
import { RepositoryDto } from '@/lib/dto/RepositoryDto';

interface AppItemProps {
  item: RepositoryDto;
  onVote: (appId: number, type: 'up' | 'down') => void;
  onToggleFavorite: (appId: number) => void;
  onDownload: (appId: number) => void;
  onViewDetails: (repositoryId: number) => void;
}

export const AppItem: React.FC<AppItemProps> = ({ item, onVote, onToggleFavorite, onDownload, onViewDetails }) => {
  const isTemplate = item.is_template ?? false;
  const isUp = item.is_voted_positive;
  const isDown = item.is_voted_negative;

  const formatDate = (d?: string | Date) => 
    d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '---';

  return (
    <div className={styles.modernCard}>
      {/* Contenido Principal */}
      <div className={styles.cardBody}>
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3 className={styles.cardTitle}>{item.name}</h3>
          <span className={`${styles.badge} ${isTemplate ? styles.badgePurple : styles.badgeBlue}`}>
            {isTemplate ? <LayoutTemplate size={12} /> : <AppWindow size={12} />}
            {isTemplate ? 'Template' : 'App'}
          </span>
        </div>

        <p className={styles.cardDescription}>{item.description}</p>

        {/* Fechas de creación y actualización de forma muy sutil */}
        <div className={styles.metadataContainer}>
          <span className={styles.metadataItem}>
            <Calendar size={12} /> Creado: {formatDate(item.created_at)}
          </span>
          {item.updated_at && (
            <span className={styles.metadataItem}>
              <RefreshCw size={12} /> Actualizado: {formatDate(item.updated_at)}
            </span>
          )}
        </div>

        {/* Lista de Servicios (Tags Rediseñados) */}
        <div className="mt-4">
          {item.services && item.services.trim().length > 0 ? (
            <div className={styles.modernTagList}>
              {item.services.split(',').map((service, index) => (
                <span key={index} className={styles.modernTag}>
                  {service.trim()}
                </span>
              ))}
            </div>
          ) : (
            <span className={styles.noServices}>Sin servicios configurados</span>
          )}
        </div>
      </div>

      {/* Footer Minimalista (Sin fondos pesados) */}
      <div className={styles.modernFooter}>
        <button onClick={() => onViewDetails(item.id)} className={styles.detailsButton}>
          <span>Ver detalle</span>
          <ArrowRight size={15} />
        </button>
        <button onClick={() => onDownload(item.id)} className={styles.modernDownloadBtn}>
          <Download size={15} />
          <span>{item.downloads}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Favoritos */}
          <button 
            onClick={() => onToggleFavorite(item.id)} 
            className={`${styles.modernFavBtn} ${item.is_favourite ? styles.favActive : ''}`}
          >
            <Star size={16} fill={item.is_favourite ? "currentColor" : "none"} />
            <span>{item.favourites}</span>
          </button>

          {/* Votación Compacta */}
          <div className={styles.modernVoteGroup}>
            <button onClick={() => onVote(item.id, "up")} className={isUp ? styles.activeUp : ""}>
              <ArrowUp size={15} strokeWidth={2.5} />
            </button>
            <span className={isUp ? styles.txtUp : isDown ? styles.txtDown : ""}>{item.votes}</span>
            <button onClick={() => onVote(item.id, "down")} className={isDown ? styles.activeDown : ""}>
              <ArrowDown size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppItem;