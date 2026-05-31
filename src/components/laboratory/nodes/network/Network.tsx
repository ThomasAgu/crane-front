import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { useState } from "react";
import { editorService } from "@/app/services/EditorService";

// Tipado estricto para los datos de la red
interface NetworkNodeData {
  name?: string;
  label?: string;
  driver?: string;
  address?: string;
  mask?: number;
  gateway?: string;
}

export const Network = ({ data, id, selected, dragging }: NodeProps<NetworkNodeData>) => {
  const [defaultName] = useState(() => editorService.getNodeNewNamesByType("network"));
  const displayName = data.name || defaultName;

  return (
    <motion.div
      animate={{
        scale: dragging ? 1.03 : 1,
        boxShadow: selected 
          ? "0px 0px 15px rgba(14, 165, 233, 0.6)"
          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderColor: selected ? "#0ea5e9" : "#0284c7"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-slate-950 text-white p-3 rounded-2xl border-2 w-64 relative cursor-grab active:cursor-grabbing text-left"
    >

      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-950 text-[10px] text-gray-400 px-2 py-0.5 rounded-md border border-gray-800 whitespace-nowrap pointer-events-none">
        Desde Servicio
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-sky-400 !w-3 !h-3 transition-transform hover:scale-125"
      />

      {/* Contenido del Nodo */}
      <div className="flex items-center justify-between gap-2">
        <div className="overflow-hidden">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-lg">🌐</span>
            <h4 className="font-bold text-base truncate tracking-tight">{displayName}</h4>
          </div>
          
          {/* CIDR Notation (IP/Mask) */}
          <p className="text-xs font-mono text-sky-400">
            {data.address || "192.168.5.0"}
            {data.mask ? `/${data.mask}` : "/24"}
          </p>
        </div>

        {/* Driver Tag (ej: bridge) */}
        <div className="text-right flex flex-col items-end shrink-0">
          <span className="text-[10px] bg-sky-950 text-sky-300 font-mono px-2 py-0.5 rounded-md border border-sky-800/40 uppercase font-semibold">
            {data.driver || "bridge"}
          </span>
          {data.gateway && (
            <span className="text-[9px] text-gray-500 font-mono mt-1">
              gw: {data.gateway}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};