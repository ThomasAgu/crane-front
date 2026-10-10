import React from "react";
import AppEditor from "../nodes/app/Editor";
import ServiceEditor from "../nodes/service/Editor";
import NetworkEditor from "../nodes/network/Editor";
import VolumeEditor from "../nodes/volume/Editor";
import EditorBase from "./EditorBase";
import type { SelectedAppMode } from "@/hooks/useLaboratory";

const editorMap: Record<string, React.FC<any>> = {
  app: AppEditor,
  service: ServiceEditor,
  network: NetworkEditor,
  volume: VolumeEditor,
};

export default function Sidebar({
  appId,
  selectedNode,
  onUpdateNode,
  nodes = [],
  edges = [],
  selectedApp,
  selectedAppMode,
  isTemplateMode,
  onTemplateModeChange,
  onFocusEditorIssue,
}: {
  appId?: number | null;
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  nodes?: any[];
  edges?: any[];
  selectedApp?: any;
  selectedAppMode: SelectedAppMode;
  isTemplateMode: boolean;
  onTemplateModeChange: (value: boolean) => void;
  onFocusEditorIssue: (nodeId: string, field: string) => void;
}) {
  const Editor = editorMap[selectedNode?.type || "app"];

  return (
    <div className="bg-white">
      <EditorBase
        appId={appId}
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
        Editor={Editor}
        nodes={nodes}
        edges={edges}
        selectedApp={selectedApp}
        selectedAppMode={selectedAppMode}
        isTemplateMode={isTemplateMode}
        onTemplateModeChange={onTemplateModeChange}
        onFocusEditorIssue={onFocusEditorIssue}
      />
    </div>
  );
}