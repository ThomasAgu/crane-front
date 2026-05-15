import { Handle, Position } from "reactflow";

export const Service = ({ data }: any) => {
  return (
    <div className="bg-gray-700 text-white p-3 rounded-xl border border-gray-500 w-56">
      <p className="text-xs text-gray-300 mb-1">Imagen {data.image || "v1.0.0"}</p>
      <h3 className="font-bold">{data.name || "Nombre del servicio"}</h3>
      <div className="flex gap-2 mt-1">
        {data.labels?.map((label: string, i: number) => (
          <span key={i} className="bg-blue-600 text-xs px-2 rounded-full">{label}</span>
        ))}
      </div>
      <div className="mt-2">
        <p><strong>Puertos:</strong> {data.ports || "8080:43"}</p>
        <p><strong>Reglas:</strong> 0</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};
