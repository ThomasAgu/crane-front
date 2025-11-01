import React, { useState } from "react";
import NetworkEditorForm from "../../forms/NetworkEditor";
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
    <NetworkEditorForm data={form} onChange={onChange} />
  );
}
