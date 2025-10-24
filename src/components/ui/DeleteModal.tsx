import { MouseEventHandler } from 'react';
import styles from './DeleteModal.module.css'

interface DeleteModalProps {
    itemName: string;
    itemType: string;
    deleteFunction: MouseEventHandler;
    setActive: Function;
}

export default function DeleteModal({itemName, itemType, deleteFunction, setActive}: DeleteModalProps) {

    const deleteCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActive(false);
    }

    return (
        <main className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Estas seguro que deseas eleiminar el {itemName} de los {itemType}</h2>
                <div className={styles.buttons}>
                    <button className={styles.deleteButton} onClick={deleteFunction}>Borrar</button>
                    <button className={styles.cancelButton} onClick={deleteCancel}>Cancelar</button>
                </div>
            </div>
        </main>
    )
}