import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { rules } from "@/lib/helper/EditorRules";

interface StartupScript {
  name: string;
  content: string;
  type: string;
}

interface ServiceNodeData {
  name: string;
  image?: string;
  label?: string;
  labels?: string[];
  ports?: string;
  command?: string;
  restartPolicy?: string;
  environment?: Record<string, any>;
  startupScripts?: StartupScript[];
}

export const Service = ({ data, selected, dragging }: NodeProps<ServiceNodeData>) => {
  const serviceRule = rules.find((r) => r.type === "service");
  const allowedConnections = serviceRule?.possibleConnectionTypes || ["network", "volume"];

  const getImageIcon = (imageName: string = "") => {
    const imgLower = imageName.toLowerCase();
    if (imgLower.includes("mysql") || imgLower.includes("mariadb") || imgLower.includes("sql")) {
      return "🐬";
    }
    if (imgLower.includes("nginx")) return "🟢";
    if (imgLower.includes("redis")) return "🟥";
    if (imgLower.includes("node")) return "⬢";
    return "🐳";
  };

  return (
    <motion.div
      animate={{
        scale: dragging ? 1.03 : 1,
        boxShadow: selected 
          ? "0px 0px 15px rgba(59, 130, 246, 0.6)"
          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderColor: selected ? "#3b82f6" : "#4b5563"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-gray-800 text-white p-4 rounded-xl border w-72 relative cursor-grab active:cursor-grabbing"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] text-gray-400 px-2 py-0.5 rounded-md border border-gray-700 whitespace-nowrap pointer-events-none">
        Desde App
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-blue-400 !w-3 !h-3 transition-transform hover:scale-125"
      />

      <div className="flex items-start gap-2.5 mb-2">
        <span className="text-2xl bg-gray-700/60 p-1.5 rounded-lg border border-gray-600/50">
          {getImageIcon(data.image || data.name)}
        </span>
        <div className="overflow-hidden w-full">
          <p className="text-[10px] tracking-wider text-blue-400 font-mono uppercase truncate">
            {data.image || "latest"}
          </p>
          <h3 className="font-bold text-lg leading-tight truncate">
            {data.name || "Nombre del servicio"}
          </h3>
        </div>
      </div>

      {data.labels && data.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {data.labels.map((label: string, i: number) => (
            <span key={i} className="bg-blue-900/60 text-blue-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-blue-800/40">
              {label}
            </span>
          ))}
        </div>
      )}

      {data.ports && (
        <div className="bg-gray-900/50 border border-gray-700/40 rounded-lg p-2 flex justify-between items-center mb-3 text-sm">
          <span className="text-gray-400 text-xs font-semibold">Puertos Mapeados</span>
          <span className="bg-gray-700 text-green-400 font-mono px-2 py-0.5 rounded text-xs border border-gray-600">
            {data.ports}
          </span>
        </div>
      )}

      {data.command && (
        <div className="mb-3 text-left">
          <span className="text-xs font-semibold text-gray-400 block mb-1">Comando (CMD)</span>
          <div className="bg-gray-900 p-1.5 rounded text-xs font-mono text-amber-400 border border-gray-700 truncate">
            $ {data.command}
          </div>
        </div>
      )}

      {data.environment && Object.keys(data.environment).length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gray-700/60 text-left">
          <span className="text-xs font-semibold text-blue-300 block mb-1">Variables de Entorno</span>
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

      {data.startupScripts && data.startupScripts.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-gray-700/60 text-left">
          <span className="text-xs font-semibold text-purple-300 block mb-1">Scripts de Inicio ({data.startupScripts.length})</span>
          <div className="flex flex-col gap-1">
            {data.startupScripts.map((script, idx) => (
              <div key={idx} className="bg-gray-900 p-1.5 rounded border border-gray-700 flex justify-between items-center text-xs font-mono">
                <span className="text-gray-300 truncate">📄 {script.name}</span>
                <span className="text-[10px] bg-purple-900/50 text-purple-300 px-1.5 rounded border border-purple-800/40 uppercase">
                  {script.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-blue-400 !w-3 !h-3 transition-transform hover:scale-125"
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-[10px] text-blue-300 px-2 py-0.5 rounded-md border border-blue-900/50 whitespace-nowrap pointer-events-none">
        Conecta con: red, volumen
      </div>
    </motion.div>
  );
};