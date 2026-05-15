// RolesMiniTable.tsx
import { RolesDto } from "@/lib/dto/RolesDto";

interface RolesMiniTableProps {
  roles: RolesDto[];
  onDelete: (id: number) => void;
  canDelete: (id: number) => boolean;
}

export const RolesMiniTable: React.FC<RolesMiniTableProps> = ({ roles, onDelete, canDelete }) => {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.id}</td>
            <td className="font-medium">{role.name}</td>
            <td className="text-right">
              <button
                onClick={() => onDelete(role.id)}
                disabled={!canDelete(role.id)}
                className={`text-xs px-3 py-1 rounded-md transition-all ${
                  canDelete(role.id) 
                    ? "text-[var(--error)] hover:bg-red-50 border border-[var(--error)]/20" 
                    : "text-gray-300 cursor-not-allowed italic"
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