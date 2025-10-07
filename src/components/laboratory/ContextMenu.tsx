// components/ContextMenu.tsx
interface ContextMenuProps {
  position: { x: number; y: number } | null;
  addNode: (type: string, x: number, y: number) => void;
}

export default function ContextMenu({ position, addNode }: ContextMenuProps) {
  if (!position) return null;

  return (
    <div
      className="absolute bg-white shadow-md rounded p-2 z-50"
      style={{ top: position.y, left: position.x }}
    >
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("app", position.x, position.y)}
      >
        ➕ Agregar App
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("service", position.x, position.y)}
      >
        ➕ Agregar Servicio
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("network", position.x, position.y)}
      >
        ➕ Agregar Red
      </button>
      <button
        className="block w-full text-left px-2 py-1 hover:bg-gray-200 text-darkest"
        onClick={() => addNode("volume", position.x, position.y)}
      >
        ➕ Agregar Volumen
      </button>
    </div>
  );
}
