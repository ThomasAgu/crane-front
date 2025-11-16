import React, { useEffect, useState } from "react";
import NetworkEditorForm from "../../forms/NetworkEditor";

export default function NetworkEditor({ data, onChange }: { 
  data: any, 
  onChange: (d: any) => void 
}) {
  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  return (
    <NetworkEditorForm 
      key={data?.id || 'network'}
      data={form} 
      onChange={onChange} 
    />
  );
}
