import React, { useState } from "react";

import Image from "next/image";

import double_expand from "../../../public/double_expand.svg"
import double_collapse from "../../../public/double_collapse.svg"


import SimulationEditor from "./simulation/SimulationEditor";
import ConfurationEditor from "./configuration/ConfigurationEditor";

type EditorState = "Edicion" | "Simulacion" | "Configuracion";

interface EditorBaseProps {
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  Editor: React.FC<any>;
}

const EditorBase: React.FC<EditorBaseProps> = ({
  selectedNode,
  onUpdateNode,
  Editor,
}) => {
    const [active, setActive] = useState(false);
    const [actualEditor, setActualEditor] = useState('Edicion');
    const editorStates: EditorState[] = ["Edicion", "Simulacion", "Configuracion"];

    return (
        <div className={active ? 'sidebar-active bg-white' : 'sidebar-inactive bg-white'} id="sidebar">
            <button 
                    onClick={() => setActive(!active)}
                    aria-label={active ? "Colapsar barra lateral" : "Expandir barra lateral"}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                    }}
                >
                    <Image 
                        src={active ? double_collapse : double_expand}
                        alt={active ? "colapsar sidebar" : "expandir sidebar"}
                        width={30} 
                        height={30} // Añadir height es buena práctica con Next/Image
                    />
                </button>
            <div className='flex items-center justify-start ms-2'>
                {active &&
                    <div style={{ display: 'flex', gap: '5px' }}>
                    {editorStates.map((state) => (
                        <button
                            key={state}
                            onClick={() => setActualEditor(state)}
                            style={{
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                backgroundColor: actualEditor === state ? '#0070f3' : 'white',
                                color: actualEditor === state ? 'white' : 'black',
                                fontWeight: actualEditor === state ? 'bold' : 'normal',
                            }}
                        >
                            {state}
                        </button>
                    ))}
                </div>
                }
            </div>
            {active && (
        <div className="p-2">
          {actualEditor === "Edicion" && selectedNode && (
            <Editor
              data={selectedNode.data}
              onChange={(newData: any) =>
                onUpdateNode(selectedNode.id, newData)
              }
            />
          )}
          {actualEditor === "Simulacion" && <SimulationEditor />}
          {actualEditor === "Configuracion" && <ConfurationEditor />}
            </div>
            )}
        </div>
    )
}

export default EditorBase;