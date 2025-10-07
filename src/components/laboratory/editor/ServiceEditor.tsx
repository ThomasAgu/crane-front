import React, { useState } from "react";

export default function ServiceEditor({ data, onChange }: { 
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
      <h2 className="text-lg font-bold mb-4">Servicio</h2>

      <label className="block text-sm font-medium">Nombre</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
      />

      <label className="block text-sm font-medium">Labels</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={(form.labels || []).join(", ")}
        onChange={(e) => update("labels", e.target.value.split(",").map(s => s.trim()))}
        placeholder="ej: Servicio, Primero"
      />

      <label className="block text-sm font-medium">Imagen</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.image || ""}
        onChange={(e) => update("image", e.target.value)}
        placeholder="Seleccionar imagen de docker"
      />

      <label className="block text-sm font-medium">Puertos</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.ports || ""}
        onChange={(e) => update("ports", e.target.value)}
        placeholder="8000:1024"
      />

      <h3 className="font-medium mt-4">Redes</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay redes definidas
      </div>

      <h3 className="font-medium mt-4">Volúmenes</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay volúmenes definidos
      </div>

      <h3 className="font-medium mt-4">Reglas</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay reglas definidas
      </div>
    </div>
  );
}
