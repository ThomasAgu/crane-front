import { UserRow } from "@/components/ui/users/UserRow";
import { RolesDto } from "@/lib/dto/RolesDto";
import { UserDataDto } from "@/lib/dto/UserDto";
import type { AlertSeverity } from "@/components/ui/AlertSnackbar";
import styles from "./users.module.css";

interface UserTableProps {
  users: UserDataDto[];
  roles: RolesDto[];
  fetchUsers: () => void;
  onShowAlert: (message: string, severity: AlertSeverity, title?: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, roles, fetchUsers, onShowAlert }) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            <th className={styles.th}>Nombre</th>
            <th className={styles.th}>Email</th>
            <th className={styles.th}>Estado</th>
            <th className={styles.th}>Roles</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onUserUpdated={fetchUsers}
              roles={roles}
              onShowAlert={onShowAlert}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};