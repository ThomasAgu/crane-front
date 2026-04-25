import { TimeRange } from "@/src/lib/types/TimeRange";


const ranges = [
  { label: "Tiempo Real", value: "0" },
  { label: "1 Hora", value: "1h" },
  { label: "1 Día", value: "1d" },
  { label: "1 Semana", value: "1w" },
  { label: "1 Mes", value: "1m" },
];

export default function TimeRangeSelector({ timeRange, setTimeRange }: { timeRange: TimeRange; setTimeRange: (timeRange: TimeRange) => void }) {
  return (
    <div>
      <div className="text-gray-700 mt-1 gap-2 flex items-center">
        {ranges.map((r) => {
          const active = timeRange === r.value;

          return (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value as TimeRange)}
              className={`
                px-2 rounded-xl transition
                ${active
                  ? "bg-primary text-white shadow" 
                  : "bg-transparent text-blue-500 border border-blue-500 hover:bg-gray-100"
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