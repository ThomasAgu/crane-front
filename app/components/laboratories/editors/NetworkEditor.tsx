import React, { useState } from "react";

export default function NetworkEditor({ data, onChange }: { 
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
      <h2 className="text-lg font-bold mb-4">Red</h2>

      <label className="block text-sm font-medium">Nombre</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.name || ""}
        onChange={(e) => update("name", e.target.value)}
      />

      <h3 className="font-medium mt-4">Integrantes</h3>
      <div className="border p-2 rounded text-sm text-gray-500 mb-4">
        Listado de servicios en la red
      </div>

      <label className="block text-sm font-medium">Driver</label>
      <select
        className="w-full border p-2 rounded mb-3"
        value={form.driver || "default"}
        onChange={(e) => update("driver", e.target.value)}
      >
        <option value="default">Default</option>
        <option value="bridge">Bridge</option>
        <option value="overlay">Overlay</option>
      </select>

      <label className="block text-sm font-medium">Dirección</label>
      <div className="flex mb-3">
        <input 
          className="flex-1 border p-2 rounded mr-2"
          value={form.address || ""}
          onChange={(e) => update("address", e.target.value)}
          placeholder="192.168.5.0"
        />
        <input 
          type="number"
          className="w-16 border p-2 rounded"
          value={form.mask || 24}
          onChange={(e) => update("mask", Number(e.target.value))}
          placeholder="/24"
        />
      </div>

      <label className="block text-sm font-medium">Gateway</label>
      <input 
        className="w-full border p-2 rounded mb-3"
        value={form.gateway || ""}
        onChange={(e) => update("gateway", e.target.value)}
        placeholder="192.168.5.1"
      />
    </div>
  );
}
