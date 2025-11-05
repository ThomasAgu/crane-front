import React, { useEffect, useState } from "react";
import NetworkEditorForm from "../../forms/NetworkEditor";

export default function NetworkEditor({ data, onChange }: { 
  data: any, 
  onChange: (d: any) => void 
}) {
  const [form, setForm] = useState(data);

  // Reset form when data changes (different node selected)
  useEffect(() => {
    setForm(data || {});
  }, [data]);

  const update = (key: string, value: any) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <NetworkEditorForm 
      key={data?.id || 'network'} // Force remount when node changes
      data={form} 
      onChange={onChange} 
    />
  );
}
