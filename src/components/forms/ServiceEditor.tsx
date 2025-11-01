import React, { useEffect, useState } from "react";
import InputText from "./InputText";

export type ServiceData = {
  name?: string;
  labels?: string[];
  image?: string;
  ports?: string;
  networks?: string[];
  volumes?: string[];
};

export class ServiceForm {
  data: ServiceData;
  errors: Record<string, string | null> = {};

  constructor(initial: ServiceData = {}) {
    this.data = {
      name: initial.name || "",
      labels: initial.labels || [],
      image: initial.image || "",
      ports: initial.ports || "",
      networks: initial.networks || [],
      volumes: initial.volumes || [],
    };
  }

  update<K extends keyof ServiceData>(key: K, value: ServiceData[K]) {
    this.data = { ...this.data, [key]: value } as ServiceData;
    return this.data;
  }

  getPayload(): ServiceData {
    return {
      ...this.data,
      name: this.data.name?.trim() || "",
      image: this.data.image?.trim() || "",
      ports: this.data.ports?.trim() || "",
    };
  }
}

/**
 * Placeholder image search - replace with real DockerHub API integration.
 */
async function searchImages(query: string): Promise<string[]> {
  // TODO: call your backend / DockerHub API and return array of image names
  if (!query) return [];
  // temporary mock
  return Promise.resolve([
    `${query}:latest`,
    `${query}:alpine`,
    `${query}:3.9`,
  ]);
}

export default function ServiceEditorForm({
  data,
  onChange,
  availableNetworks = [],
  availableVolumes = [],
}: {
  data: ServiceData;
  onChange: (d: ServiceData) => void;
  availableNetworks?: string[];
  availableVolumes?: string[];
}) {
  const [formObj] = useState(() => new ServiceForm(data));
  const [state, setState] = useState<ServiceData>(formObj.data);
  const [showErrors, setShowErrors] = useState(false);
  const [imageSuggestions, setImageSuggestions] = useState<string[]>([]);
  const [imageQuery, setImageQuery] = useState("");

  useEffect(() => {
    // sync when parent updates
    formObj.update("name", data?.name || "");
    formObj.update("labels", data?.labels || []);
    formObj.update("image", data?.image || "");
    formObj.update("ports", data?.ports || "");
    formObj.update("networks", data?.networks || []);
    formObj.update("volumes", data?.volumes || []);
    setState({ ...formObj.data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const update = <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => {
    formObj.update(key, value);
    setState({ ...formObj.data });
    onChange(formObj.getPayload());
  };

  // image search handler (debounce on your side if needed)
  const handleImageSearch = async (q: string) => {
    setImageQuery(q);
    if (!q) {
      setImageSuggestions([]);
      return;
    }
    const res = await searchImages(q);
    setImageSuggestions(res);
  };

  const togglePickNetwork = (name: string) => {
    const next = (state.networks || []).includes(name)
      ? (state.networks || []).filter((n) => n !== name)
      : [...(state.networks || []), name];
    update("networks", next);
  };

  const togglePickVolume = (name: string) => {
    const next = (state.volumes || []).includes(name)
      ? (state.volumes || []).filter((v) => v !== name)
      : [...(state.volumes || []), name];
    update("volumes", next);
  };

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Servicio</h2>

      <InputText
        label="Nombre"
        type="text"
        placeholder="Nombre del servicio"
        value={state.name || ""}
        setValue={(v: string) => update("name", v)}
        submitValidators={[]}
        showErrors={showErrors}
        imagealt="Nombre"
        setShowError={setShowErrors}
      />

      <InputText
        label="Labels"
        type="text"
        placeholder="ej: frontend,api"
        value={(state.labels || []).join(", ")}
        setShowError={setShowErrors}
        setValue={(v: string) => update("labels", v.split(",").map(s => s.trim()))}
      />

      <InputText
        label="Image (Docker)"
        type="text"
        placeholder="node, nginx, postgres"
        value={state.image || ""}
        setShowError={setShowErrors}
        setValue={(v: string) => {
          update("image", v);
          handleImageSearch(v);
        }}
        showErrors={showErrors}
      />
      {imageSuggestions.length > 0 && (
        <div className="border rounded p-2 mt-1">
          {imageSuggestions.map((img) => (
            <div
              key={img}
              className="text-sm py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => update("image", img)}
            >
              {img}
            </div>
          ))}
        </div>
      )}

      <InputText
        label="Puertos"
        type="text"
        placeholder="8000:8000, 443:443"
        setShowError={setShowErrors}
        value={state.ports || ""}
        setValue={(v: string) => update("ports", v)}
      />

      <h3 className="font-medium mt-4">Redes</h3>
      <div className="border p-2 rounded mb-3">
        {availableNetworks.length === 0 ? (
          <div className="text-sm text-gray-500">Aún no hay redes definidas</div>
        ) : (
          availableNetworks.map((n) => (
            <label key={n} className="block text-sm">
              <input
                type="checkbox"
                checked={(state.networks || []).includes(n)}
                onChange={() => togglePickNetwork(n)}
                className="mr-2"
              />
              {n}
            </label>
          ))
        )}
      </div>

      <h3 className="font-medium mt-4">Volúmenes</h3>
      <div className="border p-2 rounded mb-3">
        {availableVolumes.length === 0 ? (
          <div className="text-sm text-gray-500">Aún no hay volúmenes definidos</div>
        ) : (
          availableVolumes.map((v) => (
            <label key={v} className="block text-sm">
              <input
                type="checkbox"
                checked={(state.volumes || []).includes(v)}
                onChange={() => togglePickVolume(v)}
                className="mr-2"
              />
              {v}
            </label>
          ))
        )}
      </div>
    </div>
  );
}