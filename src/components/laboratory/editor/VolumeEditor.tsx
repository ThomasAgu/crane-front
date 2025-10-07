import React, { useState } from "react";

export default function VolumeEditor({ data, onChange }: { 
  data: any, 
  onChange: (d: any) => void 
}) {
  const [form, setForm] = useState(data);

  const update = (key: string, value: any) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Volumen</h2>

      <label className="block text-sm font-medium">Nombre</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
      />

      <label className="block text-sm font-medium">Ruta directorio del contenedor</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.containerPath || ""}
        onChange={(e) => update("containerPath", e.target.value)}
        placeholder="/app/data"
      />

      <label className="block text-sm font-medium">Ruta al directorio local</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.localPath || ""}
        onChange={(e) => update("localPath", e.target.value)}
        placeholder="/home/user/data"
      />

      <label className="block text-sm font-medium">Tamaño</label>
      <input 
        type="range" 
        min="1" 
        max="100" 
        value={form.size || 20}
        onChange={(e) => update("size", Number(e.target.value))}
      />
      <p>{form.size || 10} GB</p>
    </div>
  );
}
