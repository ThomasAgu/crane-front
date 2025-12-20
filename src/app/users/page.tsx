'use client';
import { useEffect, useState } from 'react';
import { RoleService } from '@/src/lib/api/roleService';
import { RolesDto } from '@/src/lib/dto/RolesDto';
import NavBar from '../../components/layout/NavBar';
import styles from './users.module.css'

export default function HomePage() {
  const [roles, setRoles] = useState<RolesDto[]>([]);
  const [newRole, setNewRole] = useState('');

  const fetchRoles = async () => {
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch (err) {
      console.error("❌ Error al obtener roles:", err);
    }
  };

  const handleCreateRole = async () => {
    if (!newRole.trim()) return;
    try {
      await RoleService.create(newRole);
      setNewRole('');
      await fetchRoles();
    } catch (err) {
      console.error("❌ Error al crear rol:", err);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await RoleService.delete(Number(id), Number(id));
      setRoles(roles.filter(r => r.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar rol:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <NavBar>
      <main className={styles.mainContent}>
        <h1 className="text-2xl font-bold">Gestor de Roles</h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Nuevo rol..."
            className="border rounded-lg px-3 py-1"
          />
          <button
            onClick={handleCreateRole}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
          >
            Crear
          </button>
        </div>

        <table className="min-w-[400px] border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="border px-4 py-2 text-center">{role.id}</td>
                <td className="border px-4 py-2">{role.name}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </NavBar>
  );
}
