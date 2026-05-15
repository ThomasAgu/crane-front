import { Handle, Position } from "reactflow";
import { useState } from "react";
import { editorService } from "@/src/app/services/EditorService";


export const Volume = ({ data }: any) => {
  const [defaultName] = useState(() => editorService.getNodeNewNamesByType('volume'));
  
    // Use data.name if provided, otherwise use the defaultName
  const displayName = data.name || defaultName;
  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg border border-purple-400 w-60">
      <p className="text-xs">📁 {data.size || "20"} GB</p>
      <h4 className="font-bold">{displayName}</h4>
      <div className="mt-2 text-sm text-gray-300">
        <p>{data.containerPath}</p>
        <p>{data.localPath}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};
