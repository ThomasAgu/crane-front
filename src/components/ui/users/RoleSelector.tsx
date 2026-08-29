import { RolesDto } from "@/lib/dto/RolesDto";
import { CustomSelect } from "@/components/ui/users/CustomSelect";
import styles from "@/components/ui/users/CustomSelect.module.css";

interface RoleSelectorProps {
  availableRoles: RolesDto[];
  onAddRole: (roleId: string) => void;
  canAdd: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  availableRoles,
  onAddRole,
  canAdd,
}) => {
  if (!canAdd || availableRoles.length === 0) {
    return null;
  }

  return (
    <CustomSelect
      options={availableRoles.map((role) => ({
        value: role.id.toString(),
        label: role.name,
      }))}
      value=""
      onChange={onAddRole}
      placeholder="Agregar rol"
      emptyText="No hay roles disponibles"
      className={styles.roleSelectorWrapper}
      triggerClassName={styles.roleSelectorTrigger}
      menuClassName={styles.roleSelectorMenu}
      optionClassName={styles.roleSelectorOption}
    />
  );
};
