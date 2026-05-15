import React from "react";
import AppEditor from "../nodes/app/Editor";
import ServiceEditor from "../nodes/service/Editor";
import NetworkEditor from "../nodes/network/Editor";
import VolumeEditor from "../nodes/volume/Editor";
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
  selectedApp,
}: {
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  nodes?: any[];
  edges?: any[];
  selectedApp?: any;
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
        selectedApp={selectedApp}
      />
    </div>
  );
}