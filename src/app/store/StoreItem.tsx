import React from 'react';
import styles from './store.module.css'
import { ArrowUp, ArrowDown, Star, Download } from 'lucide-react';
import Tag from '@/components/ui/Tag';
import { RepositoryDto } from '@/lib/dto/RepositoryDto';

interface AppItemProps {
  item: RepositoryDto;
  onVote: (appId: number, type: 'up' | 'down') => void;
  onToggleFavorite: (appId: number) => void;
  onDownload: (appId: number) => void;
}

export const AppItem: React.FC<AppItemProps> = ({ item, onVote, onToggleFavorite, onDownload }) => {

  const isUp = item.is_voted_positive;
  const isDown = item.is_voted_negative;

  const upColor = isUp ? "#4CAF50" : "grey";    
  const downColor = isDown ? "#F44336" : "grey";
  

  const voteNumberClass =
    isUp ? styles.voteNumberUp :
    isDown ? styles.voteNumberDown :
    styles.voteNumberNeutral;

  return (
    <div className={styles.appItem}>
      <div className={styles.appContent}>
        <h3 className={styles.appName}>{item.name}</h3>
          <div className={styles.appDescription}>
            {item.description}
          </div>
        <h5 className={styles.appSubTitle}>Servicios</h5>
          {item.services && item.services.length > 0 ? (
            <div className={styles.serviceList}>
              {item.services.split(',').map((service, index) => (
                <Tag key={index} text={service} />
              ))}
            </div>
          ): (<p>No hay servicios disponibles.</p>
          )}
      </div>
  

      <div className={styles.footer}>
        <button onClick={() => onDownload(item.id)} className={styles.downloadButton}>
          <Download size={20}/> {item.downloads} 
        </button> 

        <button 
          onClick={() => onToggleFavorite(item.id)} 
          className={styles.favButton} 
        >
         {item.is_favourite? <Star size={25} color='gold' fill='gold'/> : <Star size={25} color='grey' fill='grey' /> }
          <p className={item.is_favourite? styles.favButtonCounterActive : styles.favButtonCounter}> {item.favourites} </p> 
        </button>
        
        <div className={styles.rateButton}>
        <button
          onClick={() => onVote(item.id, "up")}
          className={isUp ? styles.activeUp : ""}
        >
          <ArrowUp size={20} strokeWidth={4} color={upColor} />
        </button>

        <p className={voteNumberClass}>{item.votes}</p>

        <button
          onClick={() => onVote(item.id, "down")}
          className={isDown ? styles.activeDown : ""}
        >
          <ArrowDown size={20} strokeWidth={4} color={downColor} />
        </button>
      </div>
      </div>
    </div>
  );
};

export default AppItem;