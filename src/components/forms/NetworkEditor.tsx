import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import { ipv4Validator, maskValidator } from "../../lib/validators/Ipv4Validator";
import { requiredValidator } from "@/src/lib/validators/RequiredValidator";
import {editorService} from "@/src/app/services/EditorService";

export type NetworkData = {
  name?: string;
  driver?: string;
  address?: string;
  mask?: number;
  gateway?: string;
  members?: string[];
};

export class NetworkForm {
  data: NetworkData;
  errors: Record<string, string | null> = {};

  constructor(initial: NetworkData = {}) {
    this.data = {
      name: initial.name || editorService.getNodeNewNamesByType('network'),
      driver: initial.driver || "default",
      address: initial.address || "",
      mask: typeof initial.mask === "number" ? initial.mask : 24,
      gateway: initial.gateway || "",
      members: initial.members || [],
    };
  }

  update<K extends keyof NetworkData>(key: K, value: NetworkData[K]) {
    this.data = { ...this.data, [key]: value } as NetworkData;
    return this.data;
  }

  // normalized payload to send back to parent
  getPayload(): NetworkData {
    return {
      ...this.data,
      address: this.data.address ? this.data.address.trim() : "",
      gateway: this.data.gateway ? this.data.gateway.trim() : "",
    };
  }
}

export default function NetworkEditorForm({
  data,
  onChange,
}: {
  data: NetworkData;
  onChange: (d: NetworkData) => void;
}) {
  const [formObj] = useState(() => new NetworkForm(data));
  const [state, setState] = useState<NetworkData>(formObj.data);
  const [showErrors, setShowErrors] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const driverInfo = {
    default: "Provee conexion local para los contenedores",
    bridge: "Conecta conetenedores en el mismo Docker daemon host",
    overlay: "Conecta multiples Docker daemons juntos y permite que los contenedores se comuniquen",
  };

  useEffect(() => {
    // sync when parent sends new data
    formObj.update("name", data?.name || "");
    formObj.update("driver", data?.driver || "default");
    formObj.update("address", data?.address || "");
    formObj.update("mask", typeof data?.mask === "number" ? data.mask : 24);
    formObj.update("gateway", data?.gateway || "");
    setState({ ...formObj.data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const update = <K extends keyof NetworkData>(key: K, value: NetworkData[K]) => {
    formObj.update(key, value);
    setState({ ...formObj.data });
    onChange(formObj.getPayload());
  };

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Red</h2>

      <InputText
        label="Nombre"
        type="text"
        placeholder="Nombre de la red"
        value={state.name || ""}
        setValue={(v: string) => update("name", v)}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        imagealt="Nombre"
        setShowError={setShowErrors}
      />

      <div className="relative mb-3">
        <label className="block font-bold">Driver</label>
        <div className="flex items-center">
          <select
            className="w-full border p-2 rounded"
            value={state.driver || "default"}
            onChange={(e) => update("driver", e.target.value)}
          >
            <option value="default">Default</option>
            <option value="bridge">Bridge</option>
            <option value="overlay">Overlay</option>
          </select>
          <div className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2 bg-gray-800 text-white text-sm rounded shadow-lg -right-2 top-6">
              {driverInfo[state.driver as keyof typeof driverInfo]}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-3" />

    
        <div className="mb-4">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <svg
            className={`h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="ml-1">Advanced Configuration</span>
        </button>
      </div>



      {showAdvanced && (
        <div className="pl-4 border-l-2 border-gray-200">
          <div className="flex mb-3">
            <InputText
              label="Dirección (IPv4)"
              type="text"
              placeholder="192.168.5.0"
              value={state.address || "192.168.5.0"}
              setValue={(v: string) => update("address", v)}
              liveValidators={[ipv4Validator]}
              showErrors={showErrors}
              imagealt="address"
              setShowError={setShowErrors}
              disabled={true}
            />

            <div style={{ width: 90, marginLeft: 8 }}>
              <InputText
                label="Mask"
                type="number"
                placeholder="16"
                value={String(state.mask ?? 16)}
                setValue={(v: string) => update("mask", Number(v))}
                liveValidators={[maskValidator]}
                showErrors={showErrors}
                imagealt="mask"
                setShowError={setShowErrors}
                disabled={true}
              />
            </div>
          </div>
          <InputText
            label="Gateway"
            type="text"
            placeholder="127.20.0.21"
            value={state.gateway || "255.255.0.0"}
            setValue={(v: string) => update("gateway", v)}
            liveValidators={[ipv4Validator]}
            showErrors={showErrors}
            imagealt="gateway"
            setShowError={setShowErrors}
            disabled={true}
          />
        </div>
      )}
    </div>
  );
}