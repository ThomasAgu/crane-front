import React, { useState } from "react";

export interface EnvironmentVariable {
  key: string;
  value: string;
}

interface EnvironmentVariablesEditorProps {
  variables: Record<string, string>;
  onChange: (variables: Record<string, string>) => void;
}

export default function EnvironmentVariablesEditor({
  variables,
  onChange,
}: EnvironmentVariablesEditorProps) {
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>(
    Object.entries(variables || {}).map(([key, value]) => ({ key, value }))
  );

  const handleAddVariable = () => {
    const newVars = [...envVars, { key: "", value: "" }];
    setEnvVars(newVars);
  };

  const handleUpdateVariable = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updated = [...envVars];
    updated[index][field] = newValue;
    setEnvVars(updated);

    // Convert back to Record format and notify parent
    const envRecord = updated.reduce(
      (acc, env) => {
        if (env.key.trim()) {
          acc[env.key.trim()] = env.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
    onChange(envRecord);
  };

  const handleRemoveVariable = (index: number) => {
    const updated = envVars.filter((_, i) => i !== index);
    setEnvVars(updated);

    // Convert back to Record format and notify parent
    const envRecord = updated.reduce(
      (acc, env) => {
        if (env.key.trim()) {
          acc[env.key.trim()] = env.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
    onChange(envRecord);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Variables de Entorno</h3>
        <button
          onClick={handleAddVariable}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          + Agregar
        </button>
      </div>

      <div className="space-y-2">
        {envVars.length > 0 ? (
          envVars.map((env, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Clave (p.ej: MYSQL_PASSWORD)"
                  value={env.key}
                  onChange={(e) =>
                    handleUpdateVariable(index, "key", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Valor"
                  value={env.value}
                  onChange={(e) =>
                    handleUpdateVariable(index, "value", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleRemoveVariable(index)}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">
            No hay variables de entorno definidas
          </p>
        )}
      </div>
    </div>
  );
}
