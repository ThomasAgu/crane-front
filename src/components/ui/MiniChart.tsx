"use client";

import React, { FC, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type MiniChartProps = {
  data: { v: number }[];
  color: string;
  type?: "auto" | "line" | "bar";
  unit?: string;
};

const fmt = (n: number, dec = 1) => Number(n).toFixed(dec);

export const MiniChart: FC<MiniChartProps> = ({ data, color, type = "auto", unit }) => {
  const chartType = useMemo(() => {
    if (type !== "auto") return type;
    return data.length <= 3 ? "bar" : "line";
  }, [data, type]);

  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-400 text-center py-4">No data</div>;
  }

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={data}>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={["auto", "auto"]} allowDecimals />
            <Tooltip
              contentStyle={{
                backgroundColor: "#26272f",
                border: "none",
                borderRadius: 8,
                color: "#fff",
              }}
              formatter={(v: number) => [`${fmt(v, 2)}${unit ?? ""}`, "Value"]}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey="i" hide />
            <YAxis hide domain={[0, "dataMax"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#26272f",
                border: "none",
                borderRadius: 8,
                color: "#fff",
              }}
              formatter={(v: number) => [`${fmt(v, 2)}${unit ?? ""}`, "Value"]}
            />
            <Bar dataKey="v" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};