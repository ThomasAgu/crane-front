import { useEffect, useId, useState } from "react";
import { AlertCircle, Plus, X } from "lucide-react";
import style from "./EnvironmentVariablesEditor.module.css";

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
  const editorId = useId();
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>(
    Object.entries(variables || {}).map(([key, value]) => ({ key, value }))
  );

  useEffect(() => {
    const incomingVars = Object.entries(variables || {}).map(([key, value]) => ({ key, value }));
    const currentCompleteVars = envVars.reduce((record, env) => {
      if (env.key.trim() && env.value.trim()) {
        record[env.key.trim()] = env.value;
      }
      return record;
    }, {} as Record<string, string>);

    const incomingRecord = incomingVars.reduce((record, env) => {
      record[env.key] = env.value;
      return record;
    }, {} as Record<string, string>);

    if (JSON.stringify(currentCompleteVars) !== JSON.stringify(incomingRecord)) {
      setEnvVars(incomingVars);
    }
  }, [variables, envVars]);

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
    <section className={style.editor} aria-labelledby="environment-variables-title">
      <div className={style.header}>
        <div className={style.heading}>
          <h3 id="environment-variables-title" className={style.title}>
            Variables de entorno
          </h3>
          <p className={style.description}>
            Configura los valores disponibles para este servicio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariable}
          disabled={hasIncompleteVar}
          className={style.addButton}
          title={hasIncompleteVar ? "Completa o elimina la variable pendiente para agregar otra" : undefined}
        >
          <Plus size={16} aria-hidden="true" />
          Agregar
        </button>
      </div>

      {(incompleteCount > 0 || invalidKeyCount > 0) && (
        <div className={style.validationSummary} role="status" aria-live="polite">
          {incompleteCount > 0 && (
            <p className={`${style.validationMessage} ${style.errorMessage}`}>
              <AlertCircle size={15} aria-hidden="true" />
              {incompleteCount} variable(s) incompleta(s)
            </p>
          )}
          {invalidKeyCount > 0 && (
            <p className={`${style.validationMessage} ${style.warningMessage}`}>
              <AlertCircle size={15} aria-hidden="true" />
              {invalidKeyCount} clave(s) con formato inválido
            </p>
          )}
        </div>
      )}

      <div className={style.variableList}>
        {envVars.length > 0 ? (
          envVars.map((env, index) => {
            const key = env.key.trim();
            const value = env.value.trim();
            const isKeyEmpty = key === "";
            const isValueEmpty = value === "";
            const isIncomplete = Boolean((key && !value) || (!key && value));
            const hasInvalidKey = key !== "" && !/^[A-Z_][A-Z0-9_]*$/.test(key);
            const rowId = `${editorId}-environment-variable-${index}`;

            return (
              <div key={index} className={style.variableRow}>
                <div className={style.fields}>
                  <label className={style.field}>
                    <span className={style.fieldLabel}>Clave</span>
                    <input
                      type="text"
                      placeholder="MYSQL_PASSWORD"
                      value={env.key}
                      onChange={(e) =>
                        handleUpdateVariable(index, "key", e.target.value)
                      }
                      aria-invalid={(isIncomplete && isKeyEmpty) || hasInvalidKey}
                      aria-describedby={isIncomplete || hasInvalidKey ? `${rowId}-message` : undefined}
                      className={`${style.input} ${
                        (isIncomplete && isKeyEmpty) || hasInvalidKey
                          ? style.invalidInput
                          : ""
                      }`}
                    />
                  </label>

                  <label className={style.field}>
                    <span className={style.fieldLabel}>Valor</span>
                    <input
                      type="text"
                      placeholder="Ingresa un valor"
                      value={env.value}
                      onChange={(e) =>
                        handleUpdateVariable(index, "value", e.target.value)
                      }
                      aria-invalid={isIncomplete && isValueEmpty}
                      aria-describedby={isIncomplete ? `${rowId}-message` : undefined}
                      className={`${style.input} ${
                        isIncomplete && isValueEmpty ? style.invalidInput : ""
                      }`}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariable(index)}
                    className={style.removeButton}
                    aria-label={`Eliminar variable ${env.key || index + 1}`}
                    title="Eliminar variable"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>

                {isIncomplete && (
                  <p id={`${rowId}-message`} className={`${style.fieldMessage} ${style.errorMessage}`}>
                    <AlertCircle size={14} aria-hidden="true" />
                    Completa tanto la clave como el valor.
                  </p>
                )}

                {!isIncomplete && hasInvalidKey && (
                  <p id={`${rowId}-message`} className={`${style.fieldMessage} ${style.warningMessage}`}>
                    <AlertCircle size={14} aria-hidden="true" />
                    Usa solo mayúsculas, números y guiones bajos (ej.: DB_HOST).
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className={style.emptyState}>
            Aún no hay variables de entorno. Agrega una para comenzar.
          </p>
        )}
      </div>
    </section>
  );
}