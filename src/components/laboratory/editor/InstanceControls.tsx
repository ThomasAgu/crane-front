import React from "react";

type InstanceVals = { actuales: number; minimas: number; maximas: number };
type Props = {
  actuales: number;
  minimas: number;
  maximas: number;
  onChange: (v: InstanceVals) => void;
};

function sanitize(values: InstanceVals): InstanceVals {
  let actuales = Math.max(0, Math.floor(Number(values.actuales) || 1));
  let minimas = Math.max(0, Math.floor(Number(values.minimas) || 1));
  let maximas = Math.max(0, Math.floor(Number(values.maximas) || 2));

  // Ensure min ≤ max
  if (minimas > maximas) maximas = minimas;
  // Ensure actuales between min and max
  if (actuales < minimas) actuales = minimas;
  if (actuales > maximas) actuales = maximas;

  return { actuales, minimas, maximas };
}

export default function InstanceControls({ actuales, minimas, maximas, onChange }: Props) {
  const apply = (next: Partial<InstanceVals>) => {
    const merged = sanitize({ actuales, minimas, maximas, ...next } as InstanceVals);
    onChange(merged);
  };

  const inc = (key: keyof InstanceVals) =>
    apply({ [key]: (key === "actuales" ? actuales : key === "minimas" ? minimas : maximas) + 1 } as any);

  const dec = (key: keyof InstanceVals) =>
    apply({ [key]: (key === "actuales" ? actuales : key === "minimas" ? minimas : maximas) - 1 } as any);

  const rows: { key: keyof InstanceVals; label: string; value: number }[] = [
    { key: "minimas", label: "Mínimas", value: minimas },
    { key: "actuales", label: "Actuales", value: actuales },
    { key: "maximas", label: "Máximas", value: maximas },
  ];

  return (
    <div className="grid gap-2">
      {rows.map(({ key, label, value }) => (
        <div
          key={key}
          className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 shadow-sm"
        >
          <span className="font-medium text-gray-700">{label}</span>

          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-40"
              onClick={() => dec(key)}
              aria-label={`decrement-${key}`}
              disabled={value <= 1 || (key === "actuales" && value <= minimas) || (key === "minimas" && value <= 0)}
            >
              −
            </button>

            <div
              className="w-16 text-center font-semibold text-gray-800"
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              {value}
            </div>

            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-40"
              onClick={() => inc(key)}
              aria-label={`increment-${key}`}
              disabled={key === "actuales" && value >= maximas}
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}