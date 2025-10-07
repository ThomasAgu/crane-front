import { Handle, Position } from "reactflow";

export const Network = ({ data }: any) => {
  return (
    <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md">
      <p className="text-xs">{data.address || "0.0.0.0"}</p>
      <h4 className="font-bold">{data.name || "Nombre de la red"}</h4>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
