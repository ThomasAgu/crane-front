import React, { FC } from "react";
import style from "styled-jsx/style";

interface KPICardProps {
  title: string;
  value: string;
  stats?: {
    min?: number;
    max?: number;
    avg?: number;
  };
  color: string;
}

/**
 * KPI Card Component - Minimalistic
 * Displays a metric with its current value and min/max/avg stats
 * Clean, stats-focused design without visualizations
 */
export const KPICard: FC<KPICardProps> = ({ title, value, stats, color }) => (
    <div className="flex flex-col rounded-xl p-4 shadow-lg border border-gray-200" style={stats?.avg !== undefined? { justifyContent: "space-between" }: {justifyContent: "center"}}>
    {/* Title */}
    <div className="text-gray-700 font-semibold tracking-widest mt-1 mb-3">
      {title}
    </div>
    
    {/* Main Value */}
    <div className="text-4xl font-bold" style={{ color: color }}>
      {value}
    </div>
    
    {/* Stats Grid */}
    {stats && (
      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-darker border rounded-xl p-2 border-gray-300 pt-3 text-darker" style={{ borderColor: color }}>
        {stats.min !== undefined && (
          <div className="flex flex-col">
            <span className="uppercase tracking-wide">Min</span>
            <span className="font-semibold mt-0.5" style={{ color: color }}>
              {stats.min.toFixed(2)}
            </span>
          </div>
        )}
        {stats.avg !== undefined && (
          <div className="flex flex-col">
            <span className="uppercase tracking-wide">Avg</span>
            <span className="font-semibold mt-0.5" style={{ color: color }}>
              {stats.avg.toFixed(2)}
            </span>
          </div>
        )}
        {stats.max !== undefined && (
          <div className="flex flex-col">
            <span className="uppercase tracking-wide">Max</span>
            <span className="font-semibold mt-0.5" style={{ color: color }}>
              {stats.max.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    )}
  </div>
);
