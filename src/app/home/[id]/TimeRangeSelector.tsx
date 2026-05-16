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
      <div className="text-gray-700 mt-1 gap-2 flex items-center">
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
                px-3 py-1 rounded-xl transition text-sm font-medium
                ${isDisabled 
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                  : isActive
                    ? "bg-blue-600 text-white shadow-md cursor-pointer" 
                    : "bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50 cursor-pointer"
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