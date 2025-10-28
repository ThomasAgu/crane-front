// components/ContextMenu.tsx
import { EditorService } from "@/src/app/services/EditorService";

interface ContextMenuProps {
  position: { x: number; y: number; nodeId?: string} | null;
  addNode: (type: string, x: number, y: number, connectedTo: string) => void;
  nodes: any[];
  onDeleteNode: (id: string) => void;
}

export default function ContextMenu({ position, addNode, nodes, onDeleteNode }: ContextMenuProps) {
  if (!position) return null;
  const canAddApp = !EditorService.isAppNodeCreated(nodes);
  const isNodeTarget = Boolean(position.nodeId);

  return (
    <div
      className="absolute bg-white shadow-md rounded p-2 z-50"
      style={{ top: position.y, left: position.x }}
    >
      <button
        className={`block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest ${canAddApp ? '' : 'opacity-50 cursor-not-allowed'}`}
        onClick={() => addNode("app", position.x, position.y, isNodeTarget ? position.nodeId! : '')}
        disabled={!canAddApp}
      >
        ➕ Agregar App
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("service", position.x, position.y, isNodeTarget ? position.nodeId! : '')}
      >
        ➕ Agregar Servicio
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("network", position.x, position.y, isNodeTarget ? position.nodeId! : '')}
      >
        ➕ Agregar Red
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("volume", position.x, position.y, isNodeTarget ? position.nodeId! : '')}
      >
        ➕ Agregar Volumen
      </button>

      {isNodeTarget && (
        <button
          className="block w-full text-left px-2 py-1 hover:bg-red-100 text-red-600"
          onClick={() => onDeleteNode(position.nodeId!)}
        >
          🗑️ Eliminar
        </button>
      )}
    </div>
  );
}
