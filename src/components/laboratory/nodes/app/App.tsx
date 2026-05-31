import { Handle, Position, NodeProps, Connection } from "reactflow";
import { motion } from "framer-motion";

interface AppNodeData {
  name: string;
  label?: string;
  description?: string;
  actuales: number;
  minimas: number;
  maximas: number;
  environment?: Record<string, any>;
  canConnectTo?: string[];
}

export const App = ({ data, selected, dragging }: NodeProps<AppNodeData>) => {
  
  const validateConnection = (connection: Connection) => {
    if (!data.canConnectTo) return true;
  
    const targetId = connection.target;
    if (!targetId) return false;

    return data.canConnectTo.some((allowedType) => 
      targetId.toUpperCase().includes(allowedType.toUpperCase())
    );
  };

  return (
    <motion.div
      animate={{
        scale: dragging ? 1.03 : 1,
        boxShadow: selected 
          ? "0px 0px 15px rgba(168, 85, 247, 0.6)" 
          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderColor: selected ? "#c084fc" : "#4b5563"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-gray-800 text-white p-4 rounded-xl border w-72 relative cursor-grab active:cursor-grabbing"
    >
      {/* Contenido Principal */}
      <div>
        <h2 className="font-bold text-xl mb-2">
          {data.name || "Nombre de aplicación"}
        </h2>
        <p className="text-sm text-gray-300 mb-3">{data.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">Instancias</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 bg-gray-700 rounded hover:bg-gray-600 transition-colors">-</button>
            <span className="font-mono">{data.actuales || 1}</span>
            <button className="px-2 py-0.5 bg-blue-600 rounded hover:bg-blue-500 transition-colors">+</button>
          </div>
        </div>
      </div>

      {data.environment && Object.keys(data.environment).length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-700 text-left">
          <span className="text-xs font-semibold text-purple-300 block mb-1">Variables de Entorno</span>
          <div className="bg-gray-900 p-2 rounded text-xs font-mono max-h-24 overflow-y-auto border border-gray-700 custom-scrollbar">
            {Object.entries(data.environment).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-2 border-b border-gray-800/50 last:border-none py-0.5">
                <span className="text-gray-400 truncate">{key}</span>
                <span className="text-green-400 truncate font-bold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] text-purple-300 px-2 py-0.5 rounded-md border border-gray-700 whitespace-nowrap pointer-events-none">
        Conecta con: servicio
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isValidConnection={validateConnection}
        className="!bg-purple-400 !w-3 !h-3 transition-transform hover:scale-125"
      />
    </motion.div>
  );
};