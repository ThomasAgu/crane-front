import { Handle, Position, NodeProps } from "reactflow";
import { motion } from "framer-motion";
import { useState } from "react";
import { editorService } from "@/app/services/EditorService";

interface VolumeNodeData {
  name?: string;
  label?: string;
  size?: number;
  type?: "volume" | "bind";
  containerPath?: string;
  localPath?: string;
}

export const Volume = ({ data, selected, dragging }: NodeProps<VolumeNodeData>) => {
  const [defaultName] = useState(() => editorService.getNodeNewNamesByType("volume"));
  const displayName = data.name || defaultName;
  const isBind = data.type === "bind";

  return (
    <motion.div
      animate={{
        scale: dragging ? 1.03 : 1,
        boxShadow: selected 
          ? "0px 0px 15px rgba(168, 85, 247, 0.6)"
          : "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderColor: selected ? "#c084fc" : "#7c3aed"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-slate-900 text-white p-3.5 rounded-2xl border-2 w-64 relative cursor-grab active:cursor-grabbing text-left"
    >
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-950 text-[10px] text-gray-400 px-2 py-0.5 rounded-md border border-gray-800 whitespace-nowrap pointer-events-none">
        In: Desde Servicio
      </div>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-purple-400 !w-3 !h-3 transition-transform hover:scale-125"
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-xl">{isBind ? "📁" : "💾"}</span>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm tracking-tight truncate">{displayName}</h4>
            <span className="text-[9px] font-mono text-purple-400 uppercase tracking-wider block">
              {data.type || "volume"}
            </span>
          </div>
        </div>

        {!isBind && (
          <span className="bg-purple-950 text-purple-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg border border-purple-800/40 shrink-0">
            {data.size || 20} GB
          </span>
        )}
      </div>

      <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-2 space-y-1.5 text-xs font-mono">
        {isBind && (
          <div className="truncate">
            <span className="text-[10px] text-gray-500 block uppercase font-sans font-semibold">Host (Origen):</span>
            <span className="text-amber-400 truncate block">{data.localPath || ""}</span>
          </div>
        )}
        <div className="truncate">
          <span className="text-[10px] text-gray-500 block uppercase font-sans font-semibold">Contenedor (Destino):</span>
          <span className="text-green-400 truncate block">{data.containerPath || ""}</span>
        </div>
      </div>
    </motion.div>
  );
};