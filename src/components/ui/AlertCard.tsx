import { Edit2, Trash2 } from "lucide-react";
import type { AlertDto } from "@/lib/dto/AlertDto";
import styles from "./AlertCard.module.css";

interface AlertCardProps {
  alert: AlertDto;
  onEdit?: (alert: AlertDto) => void;
  onDelete?: (alert: AlertDto) => void;
  disabled?: boolean;
}

export default function AlertCard({ alert, onEdit, onDelete, disabled = false }: AlertCardProps) {
  const hasActions = onEdit || onDelete;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h3>{alert.alert}</h3>
          <span className={`${styles.severity} ${styles[`severity-${alert.severity}`]}`}>
            {alert.severity}
          </span>
        </div>
        {hasActions && (
          <div className={styles.actions}>
            {onEdit && <button className={styles.editButton} onClick={() => onEdit(alert)} title="Editar alerta" disabled={disabled}><Edit2 size={16} /></button>}
            {onDelete && <button className={styles.deleteButton} onClick={() => onDelete(alert)} title="Eliminar alerta" disabled={disabled}><Trash2 size={16} /></button>}
          </div>
        )}
      </header>

      <div className={styles.content}>
        <div className={styles.field}>
          <span className={styles.label}>Expresión</span>
          <code className={styles.expression}>{alert.expr}</code>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Descripción</span>
          <p className={styles.description}>{alert.description || "Sin descripción"}</p>
        </div>
        <div className={styles.metaGrid}>
          <div><span className={styles.label}>Duración</span><strong>{typeof alert.for_time === "number" ? `${alert.for_time}s` : alert.for_time}</strong></div>
          {alert.firing_action && <div><span className={styles.label}>Activación</span><strong>{alert.firing_action}</strong></div>}
          {alert.resolved_action && <div><span className={styles.label}>Resolución</span><strong>{alert.resolved_action}</strong></div>}
        </div>
      </div>
    </article>
  );
}
