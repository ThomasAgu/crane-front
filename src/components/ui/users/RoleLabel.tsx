interface RoleLabelProps {
  id: string;
  roleName: string;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const RoleLabel: React.FC<RoleLabelProps> = ({ id, roleName, onRemove, canRemove }) => {
  return (
    <span
      className="inline-block bg-blue-100 text-blue-800 px-2 m-1 p-1 rounded-full text-xs font-medium"
      data-id={id}
    >
      {roleName}
      {canRemove && (
        <button
          onClick={() => onRemove(id)}
          className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
          aria-label={`Remove role ${roleName}`}
          >
          &times;
        </button>
      )}
    </span>
  );
};