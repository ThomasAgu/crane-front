import { RolesDto } from "@/lib/dto/RolesDto";
import type { AlertSeverity } from "@/components/ui/AlertSnackbar";
import styles from "./users.module.css";

interface RolesMiniTableProps {
  roles: RolesDto[];
  onDelete: (id: number) => void;
  canDelete: (id: number) => boolean;
  onShowAlert?: (message: string, severity: AlertSeverity, title?: string) => void;
}

export const RolesMiniTable: React.FC<RolesMiniTableProps> = ({ roles, onDelete, canDelete, onShowAlert }) => {
  return (
    <table className={styles.roleTable}>
      <thead>
        <tr>
          <th className={styles.roleTableHead}>Nombre</th>
          <th className={`${styles.roleTableHead} ${styles.roleTableAction}`}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id} className={styles.roleRow}>
            <td className={`${styles.roleTableCell} ${styles.roleName}`}>{role.name}</td>
            <td className={`${styles.roleTableCell} ${styles.roleTableAction}`}>
              <button
                onClick={() => {
                  if (!canDelete(role.id)) return;
                  onDelete(role.id);
                  onShowAlert?.("El rol ha sido eliminado exitosamente.", "error", "Rol Eliminado");
                }}
                disabled={!canDelete(role.id)}
                className={`${styles.roleActionButton} ${
                  canDelete(role.id) ? styles.roleActionButtonEnabled : styles.roleActionButtonDisabled
                }`}
              >
                {canDelete(role.id) ? "Eliminar" : role.built_in ? "Built-in" : "En uso"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};