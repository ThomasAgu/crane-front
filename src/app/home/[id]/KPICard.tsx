import React, { FC } from "react";
import { MiniChart } from "@/src/components/ui/MiniChart";

interface KPICardProps {
  title: string;
  value: string;
  sub?: string;
  color: string;
  data: { i: number; v: number }[];
}

/**
 * KPI Card Component
 * Displays a metric with its current value, description, and mini chart
 */
export const KPICard: FC<KPICardProps> = ({ title, value, sub, color, data }) => (
  <div className="flex flex-col bg-[rgba(255,255,255,0.02)] rounded-2xl p-4 shadow-xl border border-[rgba(255,255,255,0.05)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)]">
    <div className="flex items-start justify-between">
      <div className="text-xs text-gray-300 font-medium tracking-wider">
        {title}
      </div>
      <div className="text-2xl font-bold text-white ml-4">{value}</div>
    </div>
    {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    <div className="mt-4 -mb-2">
      <MiniChart data={data} color={color} />
    </div>
  </div>
);
