"use client";
import styles from "./users.module.css";

import NavBar from "../../components/layout/NavBar";
import { RolesMiniTable } from "./RolesMiniTable";
import { RolePermissionsTable } from "@/app/users/RolePermissionTable";
import { UserTable } from "./UsersTable";
import { useAlert, AlertSnackbar } from "@/components/ui/AlertSnackbar";
import { useAdminPanel } from "@/hooks/useAdminPanel";

export default function HomePage() {
  const { alertState, showAlert, handleCloseAlert } = useAlert();
  const {
    canDeleteRole,
    fetchUsers,
    handleCreateRole,
    handleDeleteRole,
    newRole,
    roles,
    setNewRole,
    users,
  } = useAdminPanel(showAlert);

  return (
    <NavBar>
      <main className={styles.page}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Administración</p>
          <h1 className={styles.title}>Usuarios y permisos</h1>
          <p className={styles.subtitle}>Administra usuarios, roles y accesos del sistema.</p>
        </header>

        <div className={styles.grid}>
          <section className={styles.usersPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Usuarios</h2>
            </div>
            <div className={styles.panelBody}>
              <UserTable users={users} roles={roles} fetchUsers={fetchUsers} onShowAlert={showAlert} />
            </div>
          </section>

          <aside className={styles.rolesPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Roles</h2>
            </div>
            <div className={styles.rolesPanelBody}>
              <div className={styles.createRoleRow}>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className={styles.roleInput}
                  placeholder="Nuevo rol..."
                />
                <button onClick={handleCreateRole} className={styles.primaryButton}>
                  Agregar
                </button>
              </div>
              <div className={styles.roleListWrap}>
                <RolesMiniTable roles={roles} onDelete={handleDeleteRole} canDelete={canDeleteRole} onShowAlert={showAlert} />
              </div>
            </div>
          </aside>

          <section className={styles.permissionsPanel}>
            <RolePermissionsTable roles={roles} />
          </section>

          <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
        </div>
      </main>
    </NavBar>
  );
}
