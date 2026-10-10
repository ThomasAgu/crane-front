import React, { useState, useEffect } from "react";

import Image from "next/image";
import styles from "./EditorBase.module.css"

import double_expand from "../../../public/double_expand.svg";
import double_collapse from "../../../public/double_collapse.svg";

import ConfigurationEditor from "./ConfigurationEditor";
import AlertEditor from "./AlertEditor";
import type { SelectedAppMode } from "@/hooks/useLaboratory";

type EditorState = "Edicion" | "Alertas" | "Configuracion";

interface EditorBaseProps {
  appId?: number | null;
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  Editor: React.FC<any>;
  nodes?: any[];
  edges?: any[];
  selectedApp?: any;
  selectedAppMode: SelectedAppMode;
  isTemplateMode: boolean;
  onTemplateModeChange: (value: boolean) => void;
  onFocusEditorIssue: (nodeId: string, field: string) => void;
}

const EditorBase: React.FC<EditorBaseProps> = ({
  appId,
  selectedNode,
  onUpdateNode,
  Editor,
  nodes = [],
  edges = [],
  selectedApp,
  selectedAppMode,
  isTemplateMode,
  onTemplateModeChange,
  onFocusEditorIssue,
}) => {
  const [active, setActive] = useState(false);
  const [actualEditor, setActualEditor] = useState("Edicion");
  const editorStates: EditorState[] = [
    "Edicion",
    ...(!isTemplateMode ? ["Alertas" as const] : []),
    "Configuracion",
  ];

  useEffect(() => {
    if (isTemplateMode && actualEditor === "Alertas") {
      setActualEditor("Configuracion");
    }
  }, [actualEditor, isTemplateMode]);

  useEffect(() => {
    if (selectedNode) {
      setActive(true);              
      setActualEditor("Edicion");
    }
  }, [selectedNode]);

  useEffect(() => {
    const handleFocusEditorField = (event: Event) => {
      const field = (event as CustomEvent<{ field?: string }>).detail?.field;
      if (!field) return;

      setActive(true);
      setActualEditor("Edicion");
      window.setTimeout(() => {
        document.querySelector<HTMLElement>(`[data-editor-field="${field}"]`)?.focus();
      }, 50);
    };

    window.addEventListener("editor:focus-field", handleFocusEditorField);
    return () => window.removeEventListener("editor:focus-field", handleFocusEditorField);
  }, []);

  return (
    <div
      className={
        active ? styles.sidebarActive : styles.sidebarInactive
      }
      id={styles.sidebar}
    >
      <div className={active ? "flex items-center p-2 gap-8 border-b" : undefined}> 
        <div className="flex items-center justify-start gap-2">
          {active && (
            <div style={{ display: "flex", gap: "5px" }}>
              {editorStates.map((state) => (
                <button
                  key={state}
                  onClick={() => setActualEditor(state)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: actualEditor === state ? "#0070f3" : "white",
                    color: actualEditor === state ? "white" : "black",
                    fontWeight: actualEditor === state ? "bold" : "normal",
                  }}
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex">
          <button
            onClick={() => setActive(!active)}
            aria-label={
              active ? "Colapsar barra lateral" : "Expandir barra lateral"
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Image
              src={active ? double_collapse : double_expand}
              alt={active ? "colapsar sidebar" : "expandir sidebar"}
              width={30}
              height={30}
            />
          </button>
        </div>
      </div>
      <div className="p-2">
      {/* Pestaña de Edición */}
      {selectedNode && active &&(
        <div className={actualEditor === "Edicion" ? "block" : "hidden"}>
          <Editor
            data={selectedNode.data}
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            isTemplateMode={isTemplateMode}
            onChange={(newData: any) => onUpdateNode(selectedNode.id, newData)}
          />
        </div>
      )}

      {/* Pestaña de Simulación */}
      {active && (
        !isTemplateMode && (
          <div className={actualEditor === "Alertas" ? "block" : "hidden"}>
            <AlertEditor
              appId={selectedAppMode === "edit" ? appId : null}
              selectedApp={selectedAppMode === "edit" ? selectedApp : null}
            />
          </div>
        )
      )}

      {/* Pestaña de Configuración */}
      {active && (
        <div className={actualEditor === "Configuracion" ? "block" : "hidden"}>
          <ConfigurationEditor 
            appId={appId} 
            isSaved={selectedAppMode === "edit"}
            selectedApp={selectedApp}
            selectedAppMode={selectedAppMode}
            isTemplateMode={isTemplateMode}
            onTemplateModeChange={onTemplateModeChange}
            onFocusEditorIssue={onFocusEditorIssue}
          />
        </div>
      )}
    </div>
    </div>
  );
};

export default EditorBase;
