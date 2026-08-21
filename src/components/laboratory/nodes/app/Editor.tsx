import { useEffect, useState } from "react";
import { editorService } from "@/app/services/EditorService";
import InstanceControls from "./InstanceControls";
import InputText from "../../../forms/InputText";
import { requiredValidator } from "@/lib/validators/RequiredValidator";
import EnvironmentVariablesEditor from "../service/EnvironmentVariablesEditor";

export type AppData = {
  name?: string;
  description?: string;
  actuales?: number;
  minimas?: number;
  maximas?: number;
  environment?: Record<string, string>;
};

export default function AppEditorForm({
  data,
  onChange,
  nodes,
  edges,
  selectedNode,
}: {
  data: AppData;
  onChange: (d: AppData) => void;
  nodes: any[];
  edges: any[];
  selectedNode: any;
}) {
  const [connectedServices, setConnectedServices] = useState<any[]>([]);
  const [isNameValid, setIsNameValid] = useState(true);
  const [triggerErrors, setTriggerErrors] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [localState, setLocalState] = useState<AppData>(() => ({
    name: data?.name ?? editorService.getNodeNewNamesByType('app'),
    description: data?.description ?? "",
    actuales: data?.actuales ?? 1,
    minimas: data?.minimas ?? 0,
    maximas: data?.maximas ?? 2,
    environment: data?.environment ?? {},
  }));

  useEffect(() => {
    if (data) {
      setLocalState({
        name: data.name ?? "",
        description: data.description ?? "",
        actuales: data.actuales ?? 1,
        minimas: data.minimas ?? 0,
        maximas: data.maximas ?? 2,
        environment: data.environment ?? {},
      });
    }
  }, [selectedNode?.id]);

  useEffect(() => {
    if (selectedNode) {
      const services = editorService.getServicesConnectedToApp(selectedNode);
      setConnectedServices(services);
    }
  }, [nodes, edges, selectedNode]);

  const updateField = <K extends keyof AppData>(key: K, value: AppData[K]) => {
    setLocalState((prev) => {
      const updated = { ...prev, [key]: value };
      onChange(updated);
      return updated;
    });
  };

  return (
    <div className="text-darkest space-y-4">
      <div>
        <h2 className="text-lg font-bold">Aplicación</h2>
        <p className="text-xs text-gray-500">Define configuracion basica de la aplicación base.</p>
      </div>

      {/* CAMPO NOMBRE */}
      <InputText
        label="Nombre"
        type="text"
        placeholder="Nombre de la aplicación"
        value={localState.name || ""}
        setValue={(v: string) => updateField("name", v)}
        submitValidators={[requiredValidator]}
        liveValidators={[requiredValidator]}
        showErrors={triggerErrors}
        setShowError={setTriggerErrors}
        onValidityChange={(isValid) => setIsNameValid(isValid)}
      />

      {/* CAMPO DESCRIPCIÓN */}
      <div>
        <label className="block text-sm font-medium text-gray-800">Descripción</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded mt-1.5 text-sm text-black focus:outline-none focus:border-blue-500 transition-colors"
          maxLength={200}
          rows={3}
          value={localState.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <p className="text-right text-[10px] text-gray-400 mt-1">
          {(localState.description?.length || 0)}/200
        </p>
      </div>

      {/* SECCIÓN AJUSTES AVANZADOS CON ANIMACIÓN SLIDE */}
      <div className="pt-2 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 hover:text-darkest py-2 transition-colors"
        >
          <span>{showAdvanced ? "▼" : "▶"} Ajustes Avanzados</span>
        </button>
        
        {/* Contenedor del Grid para controlar el alto dinámico nativo */}
        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            showAdvanced ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          {/* Contenedor interno con overflow-hidden para ocultar el contenido al colapsar */}
          <div className="overflow-hidden">
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm pl-3 border-l-2 border-l-blue-500"> 
              <EnvironmentVariablesEditor
                variables={localState.environment || {}}
                onChange={(val) => updateField("environment", val)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INSTANCIAS */}
      <div>
        <h3 className="font-semibold text-base text-gray-800 mb-2">Instancias</h3>
        <div className="grid grid-cols-1 bg-gray-50/50 p-1">
          <InstanceControls
            actuales={localState.actuales ?? 1}
            minimas={localState.minimas ?? 0}
            maximas={localState.maximas ?? 2}
            onChange={(vals) => {
              setLocalState((prev) => {
                const updated = {
                  ...prev,
                  actuales: vals.actuales,
                  minimas: vals.minimas,
                  maximas: vals.maximas,
                };
                onChange(updated);
                return updated;
              });
            }}
          />
        </div>
      </div>
    
      {/* SECCIÓN SERVICIOS CONECTADOS */}
      <div>
        <h3 className="font-semibold text-sm text-gray-800">Servicios Conectados</h3>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 mt-2 max-h-48 overflow-y-auto">
          {connectedServices.length > 0 ? (
            <ul className="space-y-2">
              {connectedServices.map((service: any, index) => (
                <li
                  key={service.id || index}
                  className="flex items-center justify-between bg-white shadow-xs border border-gray-150 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-xs text-gray-700">{service.name}</p>
                    {service.image && (
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">🐳 {service.image}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {service.ports && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                        🔌 {service.ports}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-xs italic text-center py-2">No hay servicios conectados en el grafo.</p>
          )}
        </div>
      </div>
    </div>
  );
}