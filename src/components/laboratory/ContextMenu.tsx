import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { editorService } from "@/app/services/EditorService";

interface ContextMenuProps {
  position: { x: number; y: number; nodeId?: string } | null;
  addNode: (type: string, x: number, y: number, connectedTo: string) => void;
  nodes: any[];
  onDeleteNode: (id: string) => void;
  onClose?: () => void;
}

const Icons = {
  app: (
    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  service: (
    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  network: (
    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  volume: (
    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  trash: (
    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
};

export default function ContextMenu({ position, addNode, nodes, onDeleteNode }: ContextMenuProps) {
  const isNodeTarget = Boolean(position?.nodeId);
  const targetNode = isNodeTarget && position ? nodes.find((n) => n.id === position.nodeId) : null;
  const canAddApp = !editorService.isAppNodeCreated();
  
  const allowedTypesForTarget = isNodeTarget && targetNode
    ? editorService.getAllowedAddTypesForTarget(targetNode)
    : null;

  const canShowType = (type: string) => {
    if (!isNodeTarget) return true;
    return allowedTypesForTarget ? allowedTypesForTarget.includes(type) : false;
  };

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute bg-slate-950/95 backdrop-blur-md border border-slate-800 shadow-2xl rounded-xl p-1.5 z-50 min-w-[180px] overflow-hidden"
          style={{ top: position.y, left: position.x }}
        >
          {isNodeTarget && targetNode && (
            <div className="px-2.5 py-1.5 border-b border-slate-800 text-[10px] text-gray-500 font-mono uppercase tracking-wider">
              Nodo: {targetNode.data?.name || targetNode.id}
            </div>
          )}

          <div className="space-y-0.5">
            {canShowType("app") && (
              <button
                className={`flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-slate-200 hover:bg-slate-900 ${
                  canAddApp ? "cursor-pointer" : "opacity-40 cursor-not-allowed"
                }`}
                onClick={() => addNode("app", position.x, position.y, isNodeTarget ? position.nodeId! : "")}
                disabled={!canAddApp}
              >
                {Icons.app}
                <span>Agregar App</span>
              </button>
            )}

            {canShowType("service") && (
              <button
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-slate-200 hover:bg-slate-900 cursor-pointer"
                onClick={() => addNode("service", position.x, position.y, isNodeTarget ? position.nodeId! : "")}
              >
                {Icons.service}
                <span>Agregar Servicio</span>
              </button>
            )}

            {canShowType("network") && (
              <button
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-slate-200 hover:bg-slate-900 cursor-pointer"
                onClick={() => addNode("network", position.x, position.y, isNodeTarget ? position.nodeId! : "")}
              >
                {Icons.network}
                <span>Agregar Red</span>
              </button>
            )}

            {canShowType("volume") && (
              <button
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-slate-200 hover:bg-slate-900 cursor-pointer"
                onClick={() => addNode("volume", position.x, position.y, isNodeTarget ? position.nodeId! : "")}
              >
                {Icons.volume}
                <span>Agregar Volumen</span>
              </button>
            )}

            {isNodeTarget && (
              <div className="border-t border-slate-800/80 my-1 pt-1">
                <button
                  className="flex items-center gap-2.5 w-full text-left px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors text-red-400 hover:bg-red-950/40 cursor-pointer"
                  onClick={() => onDeleteNode(position.nodeId!)}
                >
                  {Icons.trash}
                  <span>Eliminar Recurso</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}