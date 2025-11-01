import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import { ipv4Validator, maskValidator } from "../../lib/validators/Ipv4Validator";
import { requiredValidator } from "@/src/lib/validators/RequiredValidator";

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
      name: initial.name || "",
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

      <label className="block text-sm font-medium">Driver</label>
      <select
        className="w-full border p-2 rounded mb-3"
        value={state.driver || "default"}
        onChange={(e) => update("driver", e.target.value)}
      >
        <option value="default">Default</option>
        <option value="bridge">Bridge</option>
        <option value="overlay">Overlay</option>
      </select>

      <div className="flex mb-3">
        <InputText
          label="Dirección (IPv4)"
          type="text"
          placeholder="192.168.5.0"
          value={state.address || ""}
          setValue={(v: string) => update("address", v)}
          liveValidators={[ipv4Validator]}
          showErrors={showErrors}
          imagealt="address"
          setShowError={setShowErrors}
        />

        <div style={{ width: 90, marginLeft: 8 }}>
          <InputText
            label="Mask"
            type="number"
            placeholder="24"
            value={String(state.mask ?? 24)}
            setValue={(v: string) => update("mask", Number(v))}
            liveValidators={[maskValidator]}
            showErrors={showErrors}
            imagealt="mask"
            setShowError={setShowErrors}
          />
        </div>
      </div>

      <InputText
        label="Gateway"
        type="text"
        placeholder="192.168.5.1"
        value={state.gateway || ""}
        setValue={(v: string) => update("gateway", v)}
        liveValidators={[ipv4Validator]}
        showErrors={showErrors}
        imagealt="gateway"
        setShowError={setShowErrors}
      />
    </div>
  );
}