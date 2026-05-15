import { useEffect, useState } from "react";
import { editorService } from "@/src/app/services/EditorService";
import InstanceControls from "./InstanceControls";
import InputText from "../../../forms/InputText";
import { requiredValidator } from "@/src/lib/validators/RequiredValidator";
export type AppData = {
  name?: string;
  description?: string;
  actuales?: number;
  minimas?: number;
  maximas?: number;
}

export class AppForm {
  data: AppData;
  errors: Record<string, string | null> = {};

  constructor(initial: AppData = {}) {
    this.data = {
      name: initial.name || editorService.getNodeNewNamesByType('app'),
      description: initial.description || "",
      actuales: initial.actuales || 1,
      minimas: initial.minimas || 0,
      maximas: initial.maximas || 2
    };
  }

  update<K extends keyof AppData>(key: K, value: AppData[K]) {
    this.data = { ...this.data, [key]: value } as AppData;
    return this.data;
  }

  getPayload(): AppData {
    return {
      ...this.data
    };
  }
}

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
  const [formObj] = useState(() => new AppForm(data));
  const [state, setState] = useState<AppData>(formObj.data);
  const [connectedServices, setConnectedServices] = useState<any[]>([]);

  useEffect(() => {
    formObj.update("name", data?.name || formObj.data.name);
    formObj.update("description", data?.description || "");
    formObj.update("actuales", data?.actuales ?? 1);
    formObj.update("minimas", data?.minimas ?? 1);
    formObj.update("maximas", data?.maximas ?? 2);
    setState({ ...formObj.data });
  }, [data]); 

  useEffect(() => {
    if (selectedNode) {
      const services = editorService.getServicesConnectedToApp(selectedNode);
      setConnectedServices(services); 
    }
  }, [nodes, edges, selectedNode]); 

  const update = <K extends keyof AppData>(key: K, value: AppData[K]) => {
    formObj.update(key, value);
    setState({ ...formObj.data });
    onChange(formObj.getPayload());
  };

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Aplicación</h2>

      <InputText 
        label="Nombre"
        type="text"
        placeholder="Nombre de la aplicacion"
        value={state.name || ""}
        setValue={(v: string) => update("name", v)}
        submitValidators={[requiredValidator]}      
        setShowError={() => {}}
      />


      <label className="block text-sm font-medium">Descripción</label>
      <textarea
        className="w-full border p-2 rounded mb-3"
        maxLength={200}
        value={state.description || ""}
        onChange={(e) => update("description", e.target.value)}
      />
      <p className="text-xs text-gray-400">{(state.description?.length || 0)}/200</p>
      
      <h3 className="font-semibold text-lg mt-4 mb-3">Instancias</h3>
      <div className="grid grid-cols-1 gap-2">
        <InstanceControls
          actuales={state.actuales ?? 1}
          minimas={state.minimas ?? 1}
          maximas={state.maximas ?? 2}
          onChange={(vals) => {
            formObj.update("actuales", vals.actuales);
            formObj.update("minimas", vals.minimas);
            formObj.update("maximas", vals.maximas);
            setState({ ...formObj.data });
            onChange(formObj.getPayload());
          }}
        />
      </div>
      
      <h3 className="font-semibold mt-6 text-gray-800">Servicios</h3>
      <div className="border rounded-lg p-3 bg-gray-50">
        {connectedServices.length > 0 ? (
          <ul className="space-y-2">
            {connectedServices.map((service: any, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white shadow-sm border rounded-md px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-700">{service.name}</p>
                  {service.image && (<p className="text-xs text-gray-500">🐳 {service.image}</p>)}
                </div>
                <div className="text-right">
                  {service.ports && (
                    <p className="text-xs text-gray-500">🔌 {service.ports}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm italic">No hay servicios conectados</p>
        )}
      </div>

      <h3 className="font-medium mt-4">Reglas</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay reglas definidas
      </div>
    </div>
  );
}