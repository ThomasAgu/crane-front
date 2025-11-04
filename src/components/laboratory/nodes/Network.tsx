import { Handle, Position } from "reactflow";
import { editorService } from "@/src/app/services/EditorService";
import { useState } from "react";

export const Network = ({ data, id }: any) => {
  const [defaultName] = useState(() => editorService.getNodeNewNamesByType('network'));

  // Use data.name if provided, otherwise use the defaultName
  const displayName = data.name || defaultName;

  return (
    <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md">
      <p className="text-xs">{data.address || "192.168.5.0"}</p>
      <h4 className="font-bold">{displayName}</h4>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
