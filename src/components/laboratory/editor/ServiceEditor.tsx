import React, { useEffect, useState } from "react";
import InputText from "../../forms/InputText";
import { editorService } from "@/src/app/services/EditorService";
import { dockerDefaults } from "@/src/lib/helper/DockerDefaults";
import DockerImageSelector from "./DockerHubSelector";

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

      <h3 className="font-medium mt-4">Reglas</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay reglas definidas
      </div>
    </div>
  );
}
