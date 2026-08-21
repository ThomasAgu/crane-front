import styles from "./EnvironmentVariables.module.css";

interface EnvironmentVariablesProps {
  variables?: Record<string, unknown> | null;
  emptyMessage?: string;
}

export default function EnvironmentVariables({ variables, emptyMessage = "Sin variables configuradas" }: EnvironmentVariablesProps) {
  const entries = Object.entries(variables ?? {});

  if (!entries.length) return <p className={styles.empty}>{emptyMessage}</p>;

  return (
    <div className={styles.list}>
      {entries.map(([key, value]) => (
        <div className={styles.row} key={key}>
          <code className={styles.key}>{key}</code>
          <code className={styles.value}>{formatValue(value)}</code>
        </div>
      ))}
    </div>
  );
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
