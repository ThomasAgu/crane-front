// components/AppItem.tsx
import React from 'react';
import { StoreApp } from '@/src/lib/dto/AppDto';
import styles from './store.module.css'
import { ArrowUp, ArrowDown, Copy, Star, Download } from 'lucide-react';
import Tag from '@/src/components/ui/Tag';

interface AppItemProps {
  app: StoreApp;
  onVote: (appId: number, type: 'up' | 'down') => void;
  onToggleFavorite: (appId: number) => void;
  onDownload: (appId: number) => void;
}

export const AppItem: React.FC<AppItemProps> = ({ app, onVote, onToggleFavorite, onDownload }) => {
  const rating = app.votes_up - app.votes_down;
  const isFavorite = app.isFavorite;

  return (
    <div className={styles.appItem}>
      <div className={styles.appContent}>
        <h3 className={styles.appName}>{app.app.name}</h3>
          <div className={styles.appDescription}>
            {app.description}
          </div>
        <h5 className={styles.appSubTitle}>Servicios</h5>
          {app.app.services && app.app.services.length > 0 ? (
            <div className={styles.serviceList}>
              {app.app.services.map((service, index) => {
              return (
                <Tag 
                  key={index} 
                  text={service.image} 
              />
            );
          })}
      </div>
      ) : ( <></> )}   
      </div>
  

      <div className={styles.footer}>
        <button onClick={() => onDownload(app.id)} className={styles.downloadButton}>
          <Download size={20}/> {app.downloads} 
        </button> 

        <button 
          onClick={() => onToggleFavorite(app.id)} 
          className={styles.favButton} 
        >
          {isFavorite ? <Star size={25} color='gold' fill='gold'/> : <Star size={25} color='grey' fill='grey' /> } 
          <p className={styles.favButtonCounter}> {app.favourites} </p> 
        </button>
        <div className={styles.rateButton}>
          <button onClick={() => onVote(app.id, 'up')} ><ArrowUp size={20} strokeWidth={4} color='grey'/></button>
          <p>{rating}</p>
          <button onClick={() => onVote(app.id, 'down')}><ArrowDown size={20} strokeWidth={4} color='grey'/> </button>
        </div>
        
      </div>
    </div>
  );
};

export default AppItem;