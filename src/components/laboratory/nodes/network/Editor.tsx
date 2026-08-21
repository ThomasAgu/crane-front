import React, { useEffect, useState } from "react";
import InputText from "../../../forms/InputText";
import { ipv4Validator, maskValidator } from "../../../../lib/validators/Ipv4Validator";
import { requiredValidator } from "@/lib/validators/RequiredValidator";
import { editorService } from "@/app/services/EditorService";

export type NetworkData = {
  name: string;
  driver: string;
  address: string;
  mask: number;
  gateway: string;
};

interface NetworkEditorProps {
  data: Partial<NetworkData>;
  nodes: any[];
  edges: any[];
  selectedNode: any;
  onChange: (d: NetworkData) => void;
}

const driverInfo = {
  default: "Provee conexión local aislada de forma estándar para los contenedores del stack.",
  bridge: "Crea una red puente de software privada en el host. Los contenedores conectados pueden comunicarse entre sí.",
  overlay: "Habilita la comunicación segura entre múltiples demonios de Docker (Swarm/Hosts distribuidos) sin necesidad de ruteo externo."
};

export default function NetworkEditor({ 
  data, 
  onChange, 
  nodes,
  edges,
  selectedNode
}: NetworkEditorProps) {

  const getInitialState = (): NetworkData => ({
    name: data?.name || "",
    driver: data?.driver || "default",
    address: data?.address || "192.168.5.0",
    mask: typeof data?.mask === "number" ? data.mask : 24,
    gateway: data?.gateway || "192.168.5.1",
  });

  const [form, setForm] = useState<NetworkData>(getInitialState());
  const [showErrors, setShowErrors] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setForm(getInitialState());
  }, [selectedNode?.id]);

  const updateField = <K extends keyof NetworkData>(key: K, value: NetworkData[K]) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      const payload: NetworkData = {
        ...updated,
        address: typeof updated.address === "string" ? updated.address.trim() : "",
        gateway: typeof updated.gateway === "string" ? updated.gateway.trim() : "",
      };

      onChange(payload);
      return updated;
    });
  };

  return (
    <div className="text-darkest space-y-2">
      <div>
        <h2 className="text-lg font-bold">Red</h2>
        <p className="text-xs text-gray-500">Define el alcance de red y comunicación entre contenedores.</p>
      </div>

      {/* CAMPO NOMBRE */}
      <InputText
        label="Nombre de la Red"
        type="text"
        placeholder="ej: frontend-net, db-cluster"
        value={form.name}
        setValue={(v: string) => updateField("name", v)}
        liveValidators={[requiredValidator]}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      {/* SELECTOR DE DRIVER */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">Driver de Red</label>
        <div className="flex items-center">
          <select
            className="w-full border border-gray-300 p-2 rounded bg-white text-sm"
            value={form.driver}
            onChange={(e) => updateField("driver", e.target.value)}
          >
            <option value="default">Default (Bridge estándar)</option>
            <option value="bridge">Bridge</option>
            <option value="overlay">Overlay</option>
          </select>
          
          <div className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2.5 bg-gray-800 text-white text-xs rounded shadow-lg -right-2 top-6 leading-relaxed transition-all">
              {driverInfo[form.driver as keyof typeof driverInfo] || driverInfo.default}
            </div>
          </div>
        </div>
      </div>

      {/* ADVANCED CONFIGURATION */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-600 hover:text-darkest py-2 transition-colors"
        >
          <span>{showAdvanced ? "▼" : "▶"} Ajustes Avanzados</span>
        </button>

        <div 
          className={`grid transition-all duration-300 ease-in-out ${
            showAdvanced ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden"> 
            <div className="mt-4 space-y-5 pl-2 border-l-2 border-gray-100">
              
              {/* NOTA INFO */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                <p className="text-[11px] text-blue-700 leading-normal">
                  💡 <strong>Nota:</strong> Si no se altera la subred en los ajustes avanzados, Docker asignará un direccionamiento dinámico automático compatible con el driver seleccionado al desplegar.
                </p>
              </div>

              {/* DIRECCIÓN IPV4 + MÁSCARA */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <InputText
                    label="Dirección Subnet (IPv4)"
                    type="text"
                    placeholder="ej: 172.20.0.0"
                    value={form.address}
                    setValue={(v: string) => updateField("address", v)}
                    liveValidators={[ipv4Validator]}
                    showErrors={showErrors}
                    setShowError={setShowErrors}
                  />
                </div>

                <div>
                  <InputText
                    label="Máscara (CIDR)"
                    type="number"
                    placeholder="24"
                    value={String(form.mask)}
                    setValue={(v: string) => updateField("mask", Number(v))}
                    liveValidators={[maskValidator]}
                    showErrors={showErrors}
                    setShowError={setShowErrors}
                  />
                </div>
              </div>

              {/* GATEWAY */}
              <InputText
                label="Puerta de Enlace (Gateway)"
                type="text"
                placeholder="ej: 172.20.0.1"
                value={form.gateway}
                setValue={(v: string) => updateField("gateway", v)}
                liveValidators={[ipv4Validator]}
                showErrors={showErrors}
                setShowError={setShowErrors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}