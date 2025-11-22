// components/AppItem.tsx
import React from 'react';
import { StoreApp } from '@/src/lib/dto/AppDto';
import styles from './store.module.css'
import { ArrowUp, ArrowDown, Copy, Heart } from 'lucide-react';
interface AppItemProps {
  app: StoreApp;
  onVote: (appId: number, type: 'up' | 'down') => void;
  onToggleFavorite: (appId: number) => void;
  onDownload: (appId: number) => void;
}

export const AppItem: React.FC<AppItemProps> = ({ app, onVote, onToggleFavorite, onDownload }) => {
  const rating = app.votes_up - app.votes_down;
  const isFavorite = app.favourites;

  return (
    <div className={styles.appItem}>
      <h3 className={styles.appName}>{app.app.name}</h3>
      <div className={styles.stats}>
        <p>⬇️ Descargas: **{app.downloads}**</p>
      </div>

      <div className={styles.footer}>
        <button onClick={() => onDownload(app.id)} className={styles.downloadButton}>
          <Copy size={20}/> Descargar
        </button>

        <button 
          onClick={() => onToggleFavorite(app.id)} 
          className={styles.favButton} 
        >
          {isFavorite ? <Heart size={25} fill='red'/> : <Heart size={25} />}
        </button>
        <div className={styles.rateButton}>
          <button onClick={() => onVote(app.id, 'up')} ><ArrowUp size={20} /></button>
          <p>{rating}</p>
          <button onClick={() => onVote(app.id, 'down')}><ArrowDown size={20} /> </button>
        </div>
        
      </div>
    </div>
  );
};

export default AppItem;