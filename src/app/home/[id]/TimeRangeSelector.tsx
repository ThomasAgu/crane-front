import { TimeRange } from "@/lib/types/TimeRange";

const ranges = [
  { label: "Tiempo Real", value: "0" },
  { label: "1 Hora", value: "1h" },
  { label: "1 Día", value: "1d" },
  { label: "1 Semana", value: "1w" },
  { label: "1 Mes", value: "1m" },
];

interface Props {
  timeRange: TimeRange;
  setTimeRange: (timeRange: TimeRange) => void;
  appStatus: string;
}

export default function TimeRangeSelector({ timeRange, setTimeRange, appStatus }: Props) {
  return (
    <div>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        {ranges.map((r) => {
          const isActive = timeRange === r.value;
          
          // Lógica: Si es "0" (Tiempo Real) y el status no es activo, deshabilitar
          const isDisabled = r.value === "0" && appStatus.toLowerCase() !== "activo";

          return (
            <button
              key={r.value}
              disabled={isDisabled}
              onClick={() => setTimeRange(r.value as TimeRange)}
              title={isDisabled ? "Tiempo real solo disponible si la app está activa" : ""}
              className={`
                rounded-lg border px-3 py-2 text-sm font-semibold transition
                ${isDisabled 
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400" 
                  : isActive
                    ? "cursor-pointer border-blue-600 bg-blue-600 text-white shadow-sm" 
                    : "cursor-pointer border-slate-300 bg-white text-blue-700 hover:border-blue-400 hover:bg-blue-50"
                }               
              `}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}