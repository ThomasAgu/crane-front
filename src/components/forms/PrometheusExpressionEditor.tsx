'use client'

import { useState } from 'react';
import styles from './PrometheusExpressionEditor.module.css';
import { AlertCircle, Info } from 'lucide-react';

interface PrometheusExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Common metric examples for reference
const METRIC_EXAMPLES = [
  { label: 'Container CPU Usage', expr: 'container_cpu_usage_seconds_total > 0.8' },
  { label: 'Container Memory Usage', expr: 'container_memory_usage_bytes > 1073741824' },
  { label: 'Application Down', expr: 'up == 0' },
  { label: 'HTTP Request Error Rate', expr: 'rate(http_requests_total{status=~"5.."}[5m]) > 0.05' },
  { label: 'Service Response Time', expr: 'http_request_duration_seconds > 2' },
];

export default function PrometheusExpressionEditor({
  value,
  onChange,
  placeholder = 'e.g., up == 0 or rate(requests_total[5m]) > 100'
}: PrometheusExpressionEditorProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Expresión Prometheus (PromQL)</label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={styles.helpButton}
          title="Toggle help"
        >
          <Info size={16} />
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.editor}
        rows={4}
      />

      {showHelp && (
        <div className={styles.helpPanel}>
          <h4 className={styles.helpTitle}>Ejemplos de Expresiones PromQL</h4>
          <div className={styles.examplesList}>
            {METRIC_EXAMPLES.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(example.expr)}
                className={styles.exampleButton}
                title="Click to use this expression"
              >
                <span className={styles.exampleLabel}>{example.label}</span>
                <code className={styles.exampleCode}>{example.expr}</code>
              </button>
            ))}
          </div>
          <div className={styles.tips}>
            <h5 className={styles.tipsTitle}>Consejos:</h5>
            <ul className={styles.tipsList}>
              <li>Use operators: <code>==</code>, <code>!=</code>, <code>&gt;</code>, <code>&lt;</code></li>
              <li>Use aggregations: <code>sum()</code>, <code>avg()</code>, <code>max()</code>, <code>min()</code></li>
              <li>Use functions: <code>rate()</code>, <code>increase()</code>, <code>abs()</code></li>
              <li>Use ranges: <code>[5m]</code>, <code>[1h]</code> for time-based aggregations</li>
              <li>Use filters: <code>{`{job="prometheus"}`}</code> to filter metrics</li>
            </ul>
          </div>
        </div>
      )}

      <div className={styles.validation}>
        {value && value.trim() && (
          <div className={styles.validationInfo}>
            <AlertCircle size={16} />
            <span>La expresión será validada por el servidor</span>
          </div>
        )}
      </div>
    </div>
  );
}
