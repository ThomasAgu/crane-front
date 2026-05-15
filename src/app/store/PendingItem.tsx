import { Check, X } from 'lucide-react';
import { onHoldRepositoryDto } from '@/lib/dto/RepositoryDto';
import styles from './store.module.css';

interface PendingItemProps {
  item: onHoldRepositoryDto;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const PendingItem: React.FC<PendingItemProps> = ({ item, onApprove, onReject }) => {
  return (
    <div className={styles.appItem} style={{ borderLeft: '5px solid #ffcc00' }}>
      <div className={styles.appContent}>
        <div className="flex justify-between items-start">
          <h3 className={styles.appName}>{item.name}</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pendiente</span>
        </div>
        <div className={styles.appDescription}>{item.description}</div>
      </div>
      
      <div className={styles.footer} style={{ justifyContent: 'flex-end', gap: '10px' }}>
        <button 
          onClick={() => onReject(item.id)} 
          className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
        >
          <X size={18} /> Rechazar
        </button>
        <button 
          onClick={() => onApprove(item.id)} 
          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
        >
          <Check size={18} /> Aprobar
        </button>
      </div>
    </div>
  );
};