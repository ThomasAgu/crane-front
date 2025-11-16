import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import { requiredValidator } from "@/src/lib/validators/RequiredValidator";
import { PathValidator } from "@/src/lib/validators/PathValidator";

export default function VolumeEditorForm({
  data,
  onChange,
}: {
  data: any;
  onChange: (d: any) => void;
}) {
  const getInitialState = () => ({
    name: data?.name || "",
    size: data?.size || 20,
    containerPath: data?.containerPath || data?.mounts?.[0]?.containerPath || "",
    localPath: data?.localPath || data?.mounts?.[0]?.localPath || "",
  });

  const [form, setForm] = useState(getInitialState());
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setForm(getInitialState());
  }, [data]);

  useEffect(() => {
    const payload = {
      name: form.name,
      size: form.size,
      containerPath: normalizePath(form.containerPath),
      localPath: normalizePath(form.localPath),
    };
    onChange(payload);
  }, [form]);

  function normalizePath(p: string) {
    if (!p) return "";
    let s = p.trim();
    s = s.replace(/\\/g, "/");
    if (!s.startsWith("/")) s = "/" + s;
    s = s.replace(/\/+/g, "/");
    return s;
  }

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="text-darkest">
      <h2 className="text-lg font-bold mb-4">Volumen</h2>

      <InputText
        label="Nombre"
        type="text"
        placeholder="Nombre del volumen"
        value={form.name}
        setValue={(v: string) => update("name", v)}
        submitValidators={[requiredValidator]}
        showErrors={showErrors}
        setShowError={setShowErrors}
        imagealt="Nombre"
      />

      <label className="block text-sm font-medium mt-3">Tamaño (GB)</label>
      <input
        type="range"
        min={1}
        max={500}
        value={form.size}
        onChange={(e) => update("size", Number(e.target.value))}
        className="w-full"
      />
      <p className="mb-3">{form.size} GB</p>

      <div className="mb-2">
        <h3 className="font-medium">Montaje (container ↔ local)</h3>
      </div>

      <div className="border rounded p-3 mb-3">
        <InputText
          label="Ruta en el contenedor"
          type="text"
          placeholder="/app/data"
          value={form.containerPath}
          setValue={(v: string) => update("containerPath", v)}
          liveValidators={[PathValidator]}
          showErrors={showErrors}
          imagealt="ruta contenedor"
          setShowError={setShowErrors}
        />
        <InputText
          label="Ruta local"
          type="text"
          placeholder="/home/user/data"
          value={form.localPath}
          setValue={(v: string) => update("localPath", v)}
          liveValidators={[PathValidator]}
          showErrors={showErrors}
          imagealt="ruta local"
          setShowError={setShowErrors}
        />
      </div>
    </div>
  );
}