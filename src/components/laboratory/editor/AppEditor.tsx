import React, { useState } from "react";

export default function AppEditor({ data, onChange }: { 
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
      <h2 className="text-lg font-bold mb-4">Aplicación</h2>

      <label className="block text-sm font-medium">Nombre</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
      />

      <label className="block text-sm font-medium">Descripción</label>
      <textarea
        className="w-full border p-2 rounded mb-3"
        maxLength={200}
        value={form.description || ""}
        onChange={(e) => update("description", e.target.value)}
      />
      <p className="text-xs text-gray-400">{(form.description?.length || 0)}/200</p>

      <h3 className="font-medium mt-4 mb-2">Instancias</h3>
      {["actuales", "minimas", "maximas"].map((key) => (
        <div key={key} className="flex items-center mb-2">
          <span className="w-24 capitalize">{key}</span>
          <button 
            className="px-2 py-1 border rounded mr-2"
            onClick={() => update(key, Math.max((form[key] || 0) - 1, 0))}
          >-</button>
          <span>{form[key] || 0}</span>
          <button 
            className="px-2 py-1 border rounded ml-2"
            onClick={() => update(key, (form[key] || 0) + 1)}
          >+</button>
        </div>
      ))}

      <h3 className="font-medium mt-4">Servicios</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay servicios agregados
      </div>

      <h3 className="font-medium mt-4">Reglas</h3>
      <div className="border p-2 rounded text-sm text-gray-500">
        Aún no hay reglas definidas
      </div>
    </div>
  );
}
