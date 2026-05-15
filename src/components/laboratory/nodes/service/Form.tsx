import React, { useEffect, useState } from "react";
import InputText from "../../../forms/InputText";
import EnvironmentVariablesEditor from "./EnvironmentVariablesEditor";

export type StartupScript = {
  name: string;
  content: string;
  type: string;
};

export type ServiceData = {
  name?: string;
  labels?: string[];
  image?: string;
  ports?: string;
  networks?: string[];
  volumes?: string[];
  environment?: Record<string, string>;
  startupScripts?: StartupScript[];
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
      environment: initial.environment || {},
      startupScripts: initial.startupScripts || [],
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
      environment: this.data.environment || {},
      startupScripts: this.data.startupScripts || [],
    };
  }
}

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
  const [imageQuery, setImageQuery] = useState(data.image || "");

  useEffect(() => {
    // Force a complete form reset when data changes
    const newForm = new ServiceForm(data);
    setState(newForm.data);
    // Clear image suggestions and reset image query
    setImageSuggestions([]);
    setImageQuery(data.image || "");
  }, [data]);

  const update = <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => {
    const updated = { ...state, [key]: value };
    setState(updated);
    onChange(updated);
  };

  // Update the image search handler
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

  const handleStartupScriptUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newScripts: StartupScript[] = [...(state.startupScripts || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) =>
          resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      const fileType = file.name.split(".").pop() || "txt";
      newScripts.push({
        name: file.name,
        content,
        type: fileType,
      });
    }

    update("startupScripts", newScripts);
    // Reset input
    event.target.value = "";
  };

  const removeStartupScript = (index: number) => {
    const updated = (state.startupScripts || []).filter((_, i) => i !== index);
    update("startupScripts", updated);
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
        value={imageQuery}
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

      <div className="mt-6 mb-6 p-4 border border-gray-300 rounded-lg bg-white">
        <EnvironmentVariablesEditor
          variables={state.environment || {}}
          onChange={(val) => update("environment", val)}
        />
      </div>

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

      <h3 className="font-medium mt-4">Scripts de Inicio (SQL, Bash, etc.)</h3>
      <div className="border p-4 rounded mb-3 bg-gray-50">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2">
            Cargar archivos de inicio
          </label>
          <input
            type="file"
            multiple
            accept=".sql,.sh,.js,.py,.sql.gz"
            onChange={handleStartupScriptUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formatos soportados: .sql, .sh, .js, .py, .sql.gz
          </p>
        </div>

        {(state.startupScripts || []).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Archivos cargados:</h4>
            <div className="space-y-2">
              {(state.startupScripts || []).map((script, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {script.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tipo: {script.type} • {Math.round(script.content.length / 1024)} KB
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStartupScript(index)}
                    className="ml-2 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}