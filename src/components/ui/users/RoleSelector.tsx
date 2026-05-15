import { useState } from "react";
import { RolesDto } from "@/lib/dto/RolesDto";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (roleId: string) => {
    onAddRole(roleId);
    setIsOpen(false);
  };

  return (
    <div className="inline-block relative">
      {canAdd && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" bg-green-600 text-white p-2 h-6 flex items-center justify-center rounded-full hover:bg-green-700"
        >
          Agregar +
        </button>
      )}

      {isOpen && (
        <div className="absolute mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {availableRoles.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No hay roles disponibles
            </div>
          ) : (
            availableRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelect(role.id.toString())}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
              >
                {role.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
