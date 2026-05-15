import React from "react";
import VolumeEditorForm from "./Form";

export default function VolumeEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return <VolumeEditorForm data={data} onChange={onChange} />;
}