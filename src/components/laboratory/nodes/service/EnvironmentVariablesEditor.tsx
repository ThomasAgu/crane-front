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

  // Helper para procesar y enviar al padre
  const notifyParent = (updatedVars: EnvironmentVariable[]) => {
    const envRecord = updatedVars.reduce((acc, env) => {
      if (env.key.trim() && env.value.trim()) {
        acc[env.key.trim()] = env.value;
      }
      return acc;
    }, {} as Record<string, string>);
    onChange(envRecord);
  };

  const handleAddVariable = () => {
    const newVars = [...envVars, { key: "", value: "" }];
    setEnvVars(newVars);
  };

  const handleUpdateVariable = (
    index: number,
    field: "key" | "value",
    newValue: string
  ) => {
    const updated = envVars.map((item, i) => 
      i === index ? { ...item, [field]: newValue } : item
    );
    
    setEnvVars(updated);
    notifyParent(updated);
  };

  const handleRemoveVariable = (index: number) => {
    const updated = envVars.filter((_, i) => i !== index);
    setEnvVars(updated);
    notifyParent(updated);
  };

  const hasIncompleteVar = envVars.some(
    (env) => !env.key.trim() || !env.value.trim()
  );

    const incompleteCount = envVars.filter((env) => {
    const key = env.key.trim();
    const value = env.value.trim();

    return (
      (key && !value) ||
      (!key && value)
    );
  }).length;

  const invalidKeyCount = envVars.filter((env) => {
    const key = env.key.trim();

    if (!key) return false;

    return !/^[A-Z_][A-Z0-9_]*$/.test(key);
  }).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
  <div>
    <h3 className="font-semibold text-gray-800">
      Variables de Entorno
    </h3>

    {(incompleteCount > 0 || invalidKeyCount > 0) && (
      <div className="mt-1 space-y-1">
        {incompleteCount > 0 && (
          <p className="text-xs text-red-500">
            {incompleteCount} variable(s) incompleta(s)
          </p>
        )}

        {invalidKeyCount > 0 && (
          <p className="text-xs text-amber-600">
            {invalidKeyCount} clave(s) con formato inválido
          </p>
        )}
      </div>
    )}
  </div>

  <button
    onClick={handleAddVariable}
    disabled={hasIncompleteVar}
    className={`px-3 py-1 text-white text-sm rounded transition-colors ${
      hasIncompleteVar
        ? "bg-gray-300 cursor-not-allowed opacity-60"
        : "bg-blue-500 hover:bg-blue-600"
    }`}
  >
    + Agregar
  </button>
</div>

      <div className="space-y-2">
        {envVars.length > 0 ? (
    envVars.map((env, index) => {
      const key = env.key.trim();
      const value = env.value.trim();

      const isKeyEmpty = key === "";
      const isValueEmpty = value === "";

      const isIncomplete =
        (key && !value) ||
        (!key && value);

      const envKeyRegex = /^[A-Z_][A-Z0-9_]*$/;

      const hasInvalidKey =
        key !== "" &&
        !envKeyRegex.test(key);

      return (
        <div key={index}>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="MYSQL_PASSWORD"
                value={env.key}
                onChange={(e) =>
                  handleUpdateVariable(
                    index,
                    "key",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition-colors ${
                  (isIncomplete && isKeyEmpty) || hasInvalidKey
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                placeholder="Valor"
                value={env.value}
                onChange={(e) =>
                  handleUpdateVariable(
                    index,
                    "value",
                    e.target.value
                  )
                }
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 transition-colors ${
                  isIncomplete && isValueEmpty
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>

            <button
              onClick={() => handleRemoveVariable(index)}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {isIncomplete && (
            <p className="mt-1 text-xs text-red-500">
              Debes completar tanto la clave como el valor.
            </p>
          )}

          {!isIncomplete && hasInvalidKey && (
            <p className="mt-1 text-xs text-amber-600">
              La clave debe contener únicamente letras
              mayúsculas, números y guiones bajos
              (ej: MYSQL_PASSWORD, DB_HOST, API_KEY).
            </p>
          )}
        </div>
      );
  })
) : (
  <p className="text-gray-400 text-sm italic">
    No hay variables de entorno definidas
  </p>
)}
      </div>
    </div>
  );
} 