import React, { useEffect, useState } from "react";
import InputText from "../../../forms/InputText";
import { editorService } from "@/app/services/EditorService";
import { dockerDefaults } from "@/lib/helper/DockerDefaults";
import DockerImageSelector from "./DockerHubSelector";
import EnvironmentVariablesEditor from "./EnvironmentVariablesEditor";
import { requiredValidator } from "@/lib/validators/RequiredValidator";

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
  command?: string;
  restartPolicy?: string;
  nanoCpus?: string;
  memoryLimit?: string;
};

interface ServiceEditorProps {
  data: ServiceData;
  nodes: any[];
  edges: any[];
  selectedNode: any;
  onChange: (d: ServiceData) => void;
}

const restartPolicyInfo = {
  "unless-stopped": "Se reinicia automáticamente a menos que el usuario lo detenga de forma explícita.",
  "always": "Se reinicia siempre que el contenedor se detenga o falle, e incluso al iniciar el demonio de Docker.",
  "on-failure": "Se reinicia automáticamente solo si el contenedor falla debido a un error (código de salida distinto de 0).",
  "no": "El contenedor nunca se reiniciará automáticamente si se cae o se detiene.",
};

export default function ServiceEditor({
  data,
  nodes,
  edges,
  selectedNode,
  onChange,
}: ServiceEditorProps) {
  const [form, setForm] = useState<ServiceData>(data || {});
  const [triggerErrors, setTriggerErrors] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [connectedNetworks, setConnectedNetworks] = useState<any[]>([]);
  const [connectedVolumes, setConnectedVolumes] = useState<any[]>([]);

  useEffect(() => {
    const freshData = data || {};
    setForm(freshData);
  }, [data, selectedNode?.id]);

  useEffect(() => {
    if (selectedNode) {
      const networks = editorService.getNetworkDataBySelectedNode(selectedNode);
      const volumes = editorService.getVolumeNamesBySelectedNode(selectedNode);
      setConnectedVolumes(volumes);
      setConnectedNetworks(networks);
    }
  }, [nodes, edges, selectedNode]);

  const updateField = <K extends keyof ServiceData>(key: K, value: ServiceData[K]) => {
    setForm((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      };

      onChange(updated);
      return updated;
    });
  };

   const handleImagePicked = (imageName: string) => {
    setForm((prev) => {
      let updated = { ...prev, image: imageName };
      
      const defaults = dockerDefaults[imageName];
      if (defaults) {
        updated = {
          ...updated,
          ports: defaults.ports || updated.ports,
          volumes: defaults.volumes || updated.volumes,
          networks: defaults.networks || updated.networks,
          environment: defaults.environment || updated.environment,
        };
      }

      // Sincronizamos internamente con el Singleton inmutable del servicio
      if (selectedNode?.id) {
        const res = editorService.applyImageDefaultsToNode(selectedNode.id, imageName);
        window.dispatchEvent(new CustomEvent("editorService:updated", { detail: res }));
      }

      onChange(updated);
      return updated;
    });
  };

  const handleStartupScriptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newScripts: StartupScript[] = [...(form.startupScripts || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
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

    updateField("startupScripts", newScripts);
    event.target.value = "";
  };

  const removeStartupScript = (index: number) => {
    const updated = (form.startupScripts || []).filter((_, i) => i !== index);
    updateField("startupScripts", updated);
  };

  return (
    <div className="text-darkest space-y-2">
      <div>
        <h2 className="text-lg font-bold">Servicio</h2>
        <p className="text-xs text-gray-500">Define la imagen usada y su configuracion.</p>
      </div>

      {/* CAMPO NOMBRE: Validado en vivo y al guardar */}
      <InputText
        label="Nombre del Servicio"
        type="text"
        placeholder="ej: api-gateway, worker-node"
        value={form.name || ""}
        setValue={(val: string) => updateField("name", val)}
        liveValidators={[requiredValidator]}
        submitValidators={[requiredValidator]}
        showErrors={triggerErrors}
        setShowError={setTriggerErrors}
      />

      {/* CAMPO LABELS */}
      <InputText
        label="Labels (Etiquetas)"
        type="text"
        placeholder="ej: producción, v1, backend"
        value={(form.labels || []).join(",")}
        setValue={(val: string) =>
          updateField(
            "labels",
            val.split(",")
          )
        }
        setShowError={setTriggerErrors}
      />

      {/* CAMPO IMAGEN: DockerHub Selector + Buscador + Validador */}
      <div className="relative">
          <div className="mt-2">
          <DockerImageSelector
            value={form.image || ""}
            onChange={(val) => updateField("image", val)}
            onPickImage={handleImagePicked}
          />
        </div>
      </div>

      {/* ADVANCED OPTIONS */}
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
            <div className="mt-4 space-y-5 pl-2 border-l-2 border-gray-100 animate-fadeIn">
            
            {/* INFORMACIÓN SOBRE LA RED POR DEFECTO */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
              <p className="text-[11px] text-blue-700 leading-normal">
                💡 <strong>Nota:</strong> Si no se modifica las opciones avanzadas se usaran las opciones por default segun la imagen seleccionada
              </p>
            </div>
            {/* CAMPO PUERTOS */}
            <div>
              <InputText
                label="Puertos Expuestos"
                type="text"
                placeholder="ej: 8080:80, 3306:3306"
                value={form.ports || ""}
                setValue={(val: string) => updateField("ports", val)}
                setShowError={setTriggerErrors}
              />
              <p className="text-[10px] text-gray-400 mt-1 italic">
                * Si se deja vacío, el contenedor mapeará o expondrá el puerto nativo definido por la imagen de Docker (ej: 80 en Nginx).
              </p>
            </div>

            {/* CAMPO COMMAND (CMD) */}
            <div>
              <InputText
                label="Comando de Inicio (CMD)"
                type="text"
                placeholder="ej: npm run start, python app.py, -g 'daemon off;'"
                value={form.command || ""}
                setValue={(val: string) => updateField("command", val)}
                setShowError={setTriggerErrors}
              />
              <p className="text-[10px] text-gray-400 mt-1 italic">
                * Sobrescribe el comando original de ejecución de la imagen (CMD). Si está vacío se usará el predeterminado.
              </p>
            </div>

            {/* RESTART POLICY */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Política de Reinicio</label>
              <div className="flex items-center">
                <select
                  className="w-full border border-gray-300 p-2 rounded bg-white text-sm"
                  value={form.restartPolicy || "unless-stopped"}
                  onChange={(e) => updateField("restartPolicy", e.target.value)}
                >
                  <option value="unless-stopped">Unless Stopped (Recomendado)</option>
                  <option value="always">Always</option>
                  <option value="on-failure">On Failure</option>
                  <option value="no">No reiniciar (None)</option>
                </select>
                <div className="group relative ml-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="invisible group-hover:visible absolute z-10 w-64 p-2.5 bg-gray-800 text-white text-xs rounded shadow-lg -right-2 top-6 leading-relaxed transition-all">
                    {restartPolicyInfo[(form.restartPolicy as keyof typeof restartPolicyInfo) || "unless-stopped"]}
                  </div>
                </div>
              </div>
            </div>

            {/* LÍMITE DE RECURSOS */}
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50 space-y-4">
              <h4 className="text-xs font-bold text-gray-700 tracking-wide uppercase">Límites de Recursos (Resource Limits)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputText
                    label="Límite CPU (Cores)"
                    type="text"
                    placeholder="ej: 0.5 o 1.5"
                    value={form.nanoCpus || ""}
                    setValue={(val: string) => updateField("nanoCpus", val)}
                    setShowError={setTriggerErrors}
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">Ej: 0.5 equivale a medio núcleo de procesamiento.</p>
                </div>

                <div>
                  <InputText
                    label="Límite Memoria"
                    type="text"
                    placeholder="ej: 512M o 2G"
                    value={form.memoryLimit || ""}
                    setValue={(val: string) => updateField("memoryLimit", val)}
                    setShowError={setTriggerErrors}
                  />
                  <p className="text-[9px] text-gray-400 mt-0.5">Sufijos válidos: M para Megabytes, G para Gigabytes.</p>
                </div>
              </div>
            </div>

            {/* VARIABLES DE ENTORNO */}
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <EnvironmentVariablesEditor
                variables={form.environment || {}}
                onChange={(val) => updateField("environment", val)}
              />
            </div>

            {/* SCRIPTS DE INICIO */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-gray-800">Scripts de Arranque (Entrypoints)</h3>
              <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                <div>
                  <input
                    type="file"
                    multiple
                    accept=".sql,.sh,.js,.py,.sql.gz"
                    onChange={handleStartupScriptUpload}
                    className="block w-full text-xs text-gray-500
                      file:mr-4 file:py-1.5 file:px-3
                      file:rounded-md file:border-0
                      file:text-xs file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Extensiones válidas: .sql, .sh, .js, .py, .sql.gz
                  </p>
                </div>

                {(form.startupScripts || []).length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600">Archivos Cargados:</p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {(form.startupScripts || []).map((script, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-2 rounded border border-gray-200 shadow-xs"
                        >
                          <div className="overflow-hidden mr-2">
                            <div className="text-xs font-medium text-gray-800 truncate">{script.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {script.type.toUpperCase()} • {Math.round(script.content.length / 1024) || 1} KB
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStartupScript(index)}
                            className="text-[11px] text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN REDES (Calculada de forma reactiva por conexiones del grafo) */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-800">Redes Asociadas</h3>
        <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
          {connectedNetworks.length > 0 ? (
            <ul className="space-y-2">
              {connectedNetworks.map((network: any, idx) => (
                <li
                  key={network.name || idx}
                  className="flex items-center justify-between bg-white shadow-sm border rounded-md px-3 py-1.5"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-700">{network.name}</p>
                    <p className="text-xs text-gray-400">🌐 Subnet: {network.address || "Propia de Red"} </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Conectado</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-xs italic text-center py-2">
              Conecta un nodo red para asociarlo.
            </p>
          )}
        </div>
      </div>

      {/* SECCIÓN VOLÚMENES (Calculada de forma reactiva por conexiones del grafo) */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-800">Volúmenes Montados</h3>
        <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
          {connectedVolumes.length > 0 ? (
            <ul className="space-y-2">
              {connectedVolumes.map((volume: any, idx) => (
                <li
                  key={volume.name || idx}
                  className="bg-white shadow-sm border rounded-md px-3 py-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm text-gray-700">💾 {volume.name}</p>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  {volume.containerPath && (
                    <p className="text-xs text-gray-500 truncate font-mono bg-gray-50 p-1 rounded">
                      container: {volume.containerPath}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-xs italic text-center py-2">
              Conecta un nodo volumen para montarlo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}