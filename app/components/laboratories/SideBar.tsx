import React, { useState } from "react";
import AppEditor from "./editors/AppEditor";
import ServiceEditor from "./editors/ServiceEditor";
import NetworkEditor from "./editors/NetworkEditor";
import VolumeEditor from "./editors/VolumeEditor";
import EditorBase from "./editors/EditorBase";

const editorMap: Record<string, React.FC<any>> = {
  app: AppEditor,
  service: ServiceEditor,
  network: NetworkEditor,
  volume: VolumeEditor
};

export default function Sidebar({ 
  selectedNode, 
  onUpdateNode 
}: { 
  selectedNode: any, 
  onUpdateNode: (id: string, data: any) => void 
}) {
  

  const Editor = editorMap[selectedNode?.type || 'app'];

  return (
    <div className="bg-white">
      <EditorBase
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        Editor={Editor}
      />
    </div>
  );
}

/* 
<div className="p-4 border-l w-full bg-white">
      <EditorBase/>
      <Editor 
        data={selectedNode.data} 
        onChange={(newData: any) => onUpdateNode(selectedNode.id, newData)} 
      />
    </div>
*/
