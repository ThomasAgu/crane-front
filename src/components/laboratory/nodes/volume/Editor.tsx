import React, { useEffect, useState } from "react";
import InputText from "../../../forms/InputText";
import { requiredValidator } from "@/lib/validators/RequiredValidator";
import { PathValidator } from "@/lib/validators/PathValidator";

export type VolumeData = {
  name: string;
  size: number;
  type: "volume" | "bind";
  containerPath: string;
  localPath: string;
};

interface VolumeEditorProps {
  data: Partial<VolumeData>;
  onChange: (d: VolumeData) => void;
}

const volumeTypeInfo = {
  volume: "Volumen gestionado por Docker. Ideal para persistencia general. Tú defines el tamaño máximo en disco y el orquestador se encarga del resto.",
  bind: "Montaje directo del sistema de archivos del Host (Bind Mount). Vincula una carpeta real de tu servidor directamente dentro del contenedor."
};

export default function VolumeEditor({ data, onChange }: VolumeEditorProps) {
  
  const getInitialState = (): VolumeData => ({
    name: data?.name || "",
    size: data?.size || 20,
    type: data?.type || "volume",
    containerPath: data?.containerPath || "",
    localPath: data?.localPath || "",
  });

  const [form, setForm] = useState<VolumeData>(getInitialState());
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setForm(getInitialState());
  }, [data?.name]);

  const updateField = <K extends keyof VolumeData>(key: K, value: VolumeData[K]) => {
  setForm((prev) => {
    const updated = {
      ...prev,
      [key]: value,
    };

    onChange(updated);
    return updated;
  });
};

  return (
    <div className="text-darkest space-y-5">
      <div>
        <h2 className="text-lg font-bold">Volumen</h2>
        <p className="text-xs text-gray-500">Define el almacenamiento persistente para contenedores.</p>
      </div>

      <InputText
        label="Nombre del Volumen / ID"
        type="text"
        placeholder="ej: db-data, uploads-bucket"
        value={form.name}
        setValue={(v: string) => updateField("name", v)}
        liveValidators={[requiredValidator]}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
      />

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">Tipo de Montaje</label>
        <div className="flex items-center">
          <select
            className="w-full border border-gray-300 p-2 rounded bg-white text-sm"
            value={form.type}
            onChange={(e) => updateField("type", e.target.value as "volume" | "bind")}
          >
            <option value="volume">Named Volume (Volumen Nominado)</option>
            <option value="bind">Bind Mount (Carpeta del Servidor/Host)</option>
          </select>
          <div className="group relative ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="invisible group-hover:visible absolute z-10 w-64 p-2.5 bg-gray-800 text-white text-xs rounded shadow-lg -right-2 top-6 leading-relaxed transition-all">
              {volumeTypeInfo[form.type]}
            </div>
          </div>
        </div>
      </div>

      {form.type === "volume" && (
        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/50">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
            Asignación de Espacio Max
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={1}
              max={500}
              value={form.size}
              onChange={(e) => updateField("size", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-bold bg-white px-2.5 py-1 border rounded shadow-xs text-blue-600 whitespace-nowrap">
              {form.size} GB
            </span>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b pb-1.5">Puntos de Montaje</h3>
        
        <InputText
          label="Ruta destino en el Contenedor (Container Path)"
          type="text"
          placeholder="ej: /var/lib/mysql, /app/storage"
          value={form.containerPath}
          setValue={(v: string) => updateField("containerPath", v)}
          liveValidators={[PathValidator, requiredValidator]}
          showErrors={showErrors}
          setShowError={setShowErrors}
        />
        <p className="text-[10px] text-gray-400 mt-1 italic">
          * Carpeta interna del contenedor donde se montarán los datos persistidos.
        </p>

        {form.type === "bind" && (
          <div className="animate-fadeIn">
            <InputText
              label="Ruta origen en el Servidor (Host Path)"
              type="text"
              placeholder="ej: /home/user/app_data, ./data"
              value={form.localPath}
              setValue={(v: string) => updateField("localPath", v)}
              liveValidators={[PathValidator, requiredValidator]}
              showErrors={showErrors}
              setShowError={setShowErrors}
            />
            <p className="text-[10px] text-gray-400 mt-1 italic">
              * Ruta absoluta o relativa en la máquina host física.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}