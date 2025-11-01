import React from "react";
import AppEditor from "./AppEditor";
import ServiceEditor from "./ServiceEditor";
import NetworkEditor from "./NetworkEditor";
import VolumeEditor from "./VolumeEditor";
import EditorBase from "./EditorBase";

const editorMap: Record<string, React.FC<any>> = {
  app: AppEditor,
  service: ServiceEditor,
  network: NetworkEditor,
  volume: VolumeEditor,
};

export default function Sidebar({
  selectedNode,
  onUpdateNode,
  nodes = [],
  edges = [],
}: {
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  nodes?: any[];
  edges?: any[];
}) {
  const Editor = editorMap[selectedNode?.type || "app"];

  return (
    <div className="bg-white">
      <EditorBase
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        Editor={Editor}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}