import { Handle, Position } from "reactflow";

export const App = ({ data }: any) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-xl border border-purple-400 w-72">
      <h2 className="font-bold text-xl mb-2">{data.name || "Nombre de aplicación"}</h2>
      <p className="text-sm text-gray-300 mb-3">{data.description}</p>
      <div className="flex justify-between">
        <span className="font-semibold">Instancias</span>
        <div className="flex items-center gap-2">
          <button className="px-2 bg-gray-700">-</button>
          <span>1</span>
          <button className="px-2 bg-blue-600">+</button>
        </div>
      </div>
      <div className="mt-2">
        <span className="font-semibold">Reglas</span> <span className="ml-2">0</span>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
