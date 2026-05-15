import React, { useEffect, useState } from "react";
import InputText from "../../../forms/InputText";
import { editorService } from "@/src/app/services/EditorService";
import { dockerDefaults } from "@/src/lib/helper/DockerDefaults";
import DockerImageSelector from "./DockerHubSelector";
import EnvironmentVariablesEditor from "./EnvironmentVariablesEditor";

export type StartupScript = {
  name: string;
  content: string;
  type: string;
};

export default function ServiceEditor({ data, nodes, edges, selectedNode, onChange }: { 
  data: any, 
  nodes: any[],
  edges: any[],
  selectedNode: any,
  onChange: (d: any) => void 
}) {
  const [form, setForm] = useState(data);
  const [connectedNetworks, setConnectedNetworks] = useState<string[]>([]);
  const [connectedVolumes, setConnectedVolumes] = useState<string[]>([]);

  // keep local form in sync when parent gives a different node (important when selecting another node of same type)
  useEffect(() => {
    setForm(data || {});
  }, [data]);

  //Despues esto no lo vamos a necesitar como parametro
  const update = (key: string, value: any) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange(updated);
  };

  const onImagePicked = (imageName: string) => {
    // update ui form
    update("image", imageName);

    const defaults = dockerDefaults[imageName];
    if (defaults) {
      if (defaults.ports) update("ports", defaults.ports);
      if (defaults.volumes) update("volumes", defaults.volumes);
      if (defaults.networks) update("networks", defaults.networks);
      if (defaults.environment) update("environment", defaults.environment);
    }

    // update editorService internal node data (so service can be used by other helpers)
    if (selectedNode?.id) {
      const res = editorService.applyImageDefaultsToNode(selectedNode.id, imageName);
      // notify FlowChart (or any listener) to sync nodes/edges
      window.dispatchEvent(new CustomEvent("editorService:updated", { detail: res }));
    }
  };

  useEffect(() => {
    const networks = editorService.getNetworkDataBySelectedNode(selectedNode);
    const volumes = editorService.getVolumeNamesBySelectedNode(selectedNode);
    setConnectedVolumes(volumes);
    setConnectedNetworks(networks);  
  }, [nodes, edges, selectedNode]); // include selectedNode so it refreshes when selection changes

  const handleStartupScriptUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newScripts: StartupScript[] = [...(form.startupScripts || [])];

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
    const updated = (form.startupScripts || []).filter((_, i) => i !== index);
    update("startupScripts", updated);
  };


  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Servicio</h2>

      <InputText 
        label="Nombre"
        type="text"
        placeholder="Nombre del serviceio"
        value={form.name || ""}
        setValue={(val) => update("name", val)}
        setShowError={() => {}}
      />
      
      <InputText 
        label="Labels"
        type="text"
        placeholder="Servicio, Docker"
        value={(form.labels || []).join(", ")}
        setValue={(val) => update("labels", val.split(",").map((s) => s.trim()))}
        setShowError={() => {}}
      />

      <DockerImageSelector
        value={form.image || ""}
        onChange={(val) => update("image", val)}
        onPickImage={onImagePicked}
      />

      <InputText 
        label="Puertos"
        type="text"
        placeholder="8000:1024"
        value={(form.ports)}
        setValue={(val) => update("ports", val)}
        setShowError={() => {}}
      />

      <div className="mt-6 mb-6 p-4 border border-gray-300 rounded-lg bg-white">
        <EnvironmentVariablesEditor
          variables={form.environment || {}}
          onChange={(val) => update("environment", val)}
        />
      </div>

      <h3 className="font-semibold mt-6 text-gray-800">Redes</h3>
      <div className="border rounded-lg p-3 bg-gray-50">
        {connectedNetworks.length > 0 ? (
          <ul className="space-y-2">
            {connectedNetworks.map((network: any) => (
              <li
                key={network.name}
                className="flex items-center justify-between bg-white shadow-sm border rounded-md px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-700">{network.name}</p>
                  <p className="text-xs text-gray-500">📡 {network.address || "192.168.5.0"} </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm italic">No hay redes conectadas</p>
        )}
      </div>

      <h3 className="font-semibold mt-6 text-gray-800">Volúmenes</h3>
      <div className="border rounded-lg p-3 bg-gray-50">
        {connectedVolumes.length > 0 ? (
          <ul className="space-y-2">
            {connectedVolumes.map((volume: any) => (
              <li
                key={volume.name}
                className="bg-white shadow-sm border rounded-md px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-700">{volume.name}</p>
                <p className="text-xs text-gray-500">
                  💾 Tamaño: {volume.size || 20} GB
                </p>
                {(volume.containerPath || volume.localPath) && (
                  <p className="text-xs text-gray-500 truncate">
                    📁 {volume.containerPath || volume.localPath}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm italic">No hay volúmenes conectados</p>
        )}
      </div>

      <h3 className="font-semibold mt-6 text-gray-800">Scripts de Inicio (SQL, Bash, etc.)</h3>
      <div className="border rounded-lg p-3 bg-gray-50">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-2 text-gray-700">
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

        {(form.startupScripts || []).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 text-gray-700">Archivos cargados:</h4>
            <div className="space-y-2">
              {(form.startupScripts || []).map((script, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
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
                    className="ml-2 px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    ✕ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="font-medium mt-4">Reglas</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay reglas definidas
      </div>
    </div>
  );
}
