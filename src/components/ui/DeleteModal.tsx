import type { MouseEventHandler } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './DeleteModal.module.css';

interface DeleteModalProps {
  itemName: string;
  itemType: string;
  deleteFunction: MouseEventHandler<HTMLButtonElement>;
  setActive: (active: boolean) => void;
  placement?: 'viewport' | 'item';
}

export default function DeleteModal({
  itemName,
  itemType,
  deleteFunction,
  setActive,
  placement = 'viewport',
}: DeleteModalProps) {
  const deleteCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setActive(false);
  };

  return (
    <div
      className={`${styles.overlay} ${placement === 'item' ? styles.itemOverlay : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className={styles.modalIcon} aria-hidden="true">
          <Trash2 size={22} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title} id="delete-modal-title">¿Eliminar elemento?</h2>
          <p className={styles.description} id="delete-modal-description">
            Se eliminará <span className={styles.itemName}>{itemName}</span> ({itemType}).
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={deleteCancel} type="button">
            Cancelar
          </button>
          <button className={styles.deleteButton} onClick={deleteFunction} type="button">
            Eliminar
          </button>
        </div>
      </section>
    </div>
  );
}