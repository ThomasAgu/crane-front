import { editorService } from "@/src/app/services/EditorService";
import React, { useState, useEffect } from "react";
import InputText from "../../forms/InputText";
import InstanceControls from "./InstanceControls";

export default function AppEditor({ data, nodes, edges, selectedNode, onChange }: { 
  data: any, 
  nodes: any[],
  edges: any[],
  selectedNode: any,
  onChange: (d: any) => void 
}) {
  const [form, setForm] = useState(data);
  const [connectedServices, setConnectedServices] = useState<string[]>([]);
  
  //Despues esto no lo vamos a necesitar como parametro
  const update = (key: string, value: any) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange(updated);
  };

  const handleUpdateWithRules = (key: string, value: string) => {
    let newForm = { ...form, [key]: value };

    const actuales = newForm.actuales ?? 1;
    const minimas = newForm.minimas ?? 1;
    const maximas = newForm.maximas ?? 2;

    if (key === "actuales") {
      if (value < minimas) newForm.actuales = minimas;
      if (value > maximas) newForm.actuales = maximas;
    }

    if (key === "minimas") {
      if (value > actuales) newForm.minimas = actuales;
    }

    if (key === "maximas") {
      if (value < actuales) newForm.maximas = actuales;
    }

    update(key, newForm[key]);
  };

  useEffect(() => {
      const services = editorService.getServicesConnectedToApp(selectedNode);
      setConnectedServices(services);  
    }, [nodes, edges]);

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Aplicación</h2>


      <InputText 
        label="Nombre"
        type="text"
        placeholder="Nombre de la aplicacion"
        value={form.name || ""}
        setValue={(val) => update("name", val)}
        setShowError={() => {}}
      />


      <label className="block text-sm font-medium">Descripción</label>
      <textarea
        className="w-full border p-2 rounded mb-3"
        maxLength={200}
        value={form.description || ""}
        onChange={(e) => update("description", e.target.value)}
      />
      <p className="text-xs text-gray-400">{(form.description?.length || 0)}/200</p>

      <h3 className="font-semibold text-lg mt-4 mb-3">Instancias</h3>
      <div className="grid grid-cols-1 gap-2">
        <InstanceControls
          actuales={form.actuales ?? 1}
          minimas={form.minimas ?? 1}
          maximas={form.maximas ?? 2}
          onChange={(vals) => {
            const updated = { ...form, ...vals };
            setForm(updated);
            onChange(updated); // prop onChange del AppEditor -> prop del padre
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
