import React, { useEffect, useState } from "react";
import AppEditorForm, { AppData } from "../../forms/AppEditorForm";

export default function AppEditor({
  data,
  nodes,
  edges,
  selectedNode,
  onChange,
}: {
  data: AppData;
  nodes: any[];
  edges: any[];
  selectedNode: any;
  onChange: (d: AppData) => void;
}) {
  const [form, setForm] = useState<AppData>(data);

  useEffect(() => {
    setForm(data || {});
  }, [data]);

  return (
    <AppEditorForm
      key={data.name || "app"}
      data={form}
      onChange={onChange}
      nodes={nodes}
      edges={edges}
      selectedNode={selectedNode}
    />
  );
}
