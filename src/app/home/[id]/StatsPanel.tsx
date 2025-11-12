"use client";

import React, { FC, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { MiniChart } from "@/src/components/ui/MiniChart";
import type { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";

type HistItem = {
  container_id: string;
  container_name: string;
  series: number[];
  latest: ContainerStatsDto;
};

const COLORS = {
  bg: "#1e1f29",
  surface: "#26272f",
  muted: "#9aa0ad",
  cpu: "#ef4444",
  mem: "#3b82f6",
  net: "#10b981",
  disk: "#f59e0b",
};

const fmt = (n: number, d = 1) => (isNaN(n) ? "0" : n.toFixed(d));

/* ---------- KPI CARDS ---------- */
const KPI: FC<{
  title: string;
  value: string;
  sub?: string;
  color: string;
  data: { v: number }[];
}> = ({ title, value, sub, color, data }) => (
  <div className="flex flex-col bg-[rgba(255,255,255,0.02)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-300 font-medium">{title}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
    {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    <div className="mt-3">
      <MiniChart data={data} color={color} />
    </div>
  </div>
);

/* ---------- SMALL TREND ---------- */
const MiniTrend: FC<{ data: { v: number }[]; color?: string }> = ({
  data,
  color = COLORS.mem,
}) => (
  <div className="w-36 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="i" hide />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#26272f",
            border: "none",
            borderRadius: 8,
            color: "#fff",
          }}
          formatter={(v: number) => [`${fmt(v, 2)}`, "Value"]}
        />
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/* ---------- MAIN CHART ---------- */
const MainChart: FC<{
  seriesByContainer: Record<
    string,
    { name: string; data: { i: number; v: number }[] }
  >;
  activeKey: string | null;
  metricLabel: string;
  color: string;
}> = ({ seriesByContainer, activeKey, metricLabel, color }) => {
  const keys = Object.keys(seriesByContainer);
  const length = Math.max(
    ...keys.map((k) => seriesByContainer[k].data.length),
    0
  );

  const aggregated = Array.from({ length }).map((_, i) => {
    const item: any = { i };
    keys.forEach((k) => {
      item[k] = seriesByContainer[k].data[i]
        ? Number(seriesByContainer[k].data[i].v)
        : 0;
    });
    item.total = keys.reduce(
      (s, k) =>
        s +
        (seriesByContainer[k].data[i]
          ? Number(seriesByContainer[k].data[i].v)
          : 0),
      0
    );
    return item;
  });

  return (
    <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-200">{metricLabel}</div>
        <div className="text-xs text-gray-400">Last {length} points</div>
      </div>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregated}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="i"
              tick={{ fill: "#9aa0ad", fontSize: 11 }}
              stroke="rgba(255,255,255,0.05)"
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#9aa0ad", fontSize: 11 }}
              stroke="rgba(255,255,255,0.05)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#26272f",
                border: "none",
                borderRadius: 8,
                color: "#fff",
              }}
              labelFormatter={(i: number) => `Point ${i}`}
              formatter={(v: number) => [`${fmt(v, 2)}`, "Total"]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */
export const StatsDashboard: FC<{ histories: HistItem[] }> = ({ histories }) => {
  const safe = histories ?? [];
  const [activeTab, setActiveTab] = useState<
    "cpu" | "memory" | "net" | "disk"
  >("cpu");
  const [highlightContainer, setHighlightContainer] = useState<string | null>(
    null
  );

  const avg = (key: keyof ContainerStatsDto) =>
    safe.length
      ? safe.reduce((acc, h) => acc + Number(h.latest[key] ?? 0), 0) /
        safe.length
      : 0;

  const seriesByContainer = useMemo(() => {
    const map: Record<
      string,
      { name: string; data: { i: number; v: number }[] }
    > = {};
    safe.forEach((h) => {
      const data = (h.series ?? []).map((v, i) => ({ i, v }));
      map[h.container_id] = { name: h.container_name, data };
    });
    return map;
  }, [safe]);

  const kpiData = useMemo(() => ({
    cpu: safe.map((h, i) => ({ i, v: h.latest.cpu_percentage ?? 0 })),
    memory: safe.map((h, i) => ({ i, v: h.latest.memory_percentage ?? 0 })),
    net: safe.map((h, i) => ({ i, v: ((h.latest.net_upload ?? 0) + (h.latest.net_download ?? 0)) / 1024 })),
    disk: safe.map((h, i) => ({ i, v: ((h.latest.block_read ?? 0) + (h.latest.block_write ?? 0)) / 1024 })),
}), [safe]);

  const mainColor =
    activeTab === "cpu"
      ? COLORS.cpu
      : activeTab === "memory"
      ? COLORS.mem
      : activeTab === "net"
      ? COLORS.net
      : COLORS.disk;

  return (
    <div className="min-h-screen bg-[#1e1f29] text-white p-6 flex flex-col gap-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-xl font-semibold">
            DB
          </div>
          <div>
            <div className="text-lg font-semibold">mysql</div>
            <div className="text-xs text-gray-400">
              my-swarm / instances: {safe.length} — status:{" "}
              <span className="text-green-400">healthy</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-300 bg-[rgba(255,255,255,0.03)] px-3 py-2 rounded-md">
            Refresh
          </button>
          <button className="text-sm text-gray-300 bg-[rgba(255,255,255,0.03)] px-3 py-2 rounded-md">
            Settings
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          title="CPU"
          value={`${fmt(avg("cpu_percentage"), 1)}%`}
          color={COLORS.cpu}
          data={kpiData.cpu}
        />
        <KPI
          title="Memory"
          value={`${fmt(avg("memory_percentage"), 1)}%`}
          color={COLORS.mem}
          data={kpiData.memory}
        />
        <KPI
          title="Network (KB/s)"
          value={`${fmt(avg("net_upload") / 1024, 1)}/${fmt(
            avg("net_download") / 1024,
            1
          )}`}
          sub="↑ upload / ↓ download"
          color={COLORS.net}
          data={kpiData.net}
        />
        <KPI
          title="Disk IO (KB/s)"
          value={`${fmt(
            (avg("block_read") + avg("block_write")) / 1024,
            1
          )} KB/s`}
          sub="read / write"
          color={COLORS.disk}
          data={kpiData.disk}
        />
      </div>

      {/* MAIN CHART + SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            {(["cpu", "memory", "net", "disk"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-sm px-3 py-1 rounded-md transition-colors ${
                  activeTab === t
                    ? "bg-[rgba(255,255,255,0.05)] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <MainChart
            seriesByContainer={seriesByContainer}
            activeKey={highlightContainer}
            metricLabel={activeTab.toUpperCase()}
            color={mainColor}
          />
        </div>

        {/* SIDEBAR CONTAINERS */}
        <div className="flex flex-col gap-4">
          <div className="bg-[rgba(255,255,255,0.02)] rounded-2xl p-4">
            <div className="text-sm font-medium text-gray-200">
              Top Containers
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {safe.slice(0, 6).map((h) => (
                <div
                  key={h.container_id}
                  onMouseEnter={() => setHighlightContainer(h.container_id)}
                  onMouseLeave={() => setHighlightContainer(null)}
                  className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                    highlightContainer === h.container_id
                      ? "bg-[rgba(255,255,255,0.05)]"
                      : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {h.container_name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {fmt(h.latest.cpu_percentage, 1)}% CPU —{" "}
                      {fmt(h.latest.memory_percentage, 1)}% MEM —{" "}
                      {Math.round((h.latest.memory_used ?? 0) / 1024 / 1024)} MB
                    </div>
                  </div>
                  <MiniTrend
                    data={(h.series ?? []).map((v, i) => ({ i, v }))}
                    color={COLORS.mem}
                  />
                </div>
              ))}

              {safe.length === 0 && (
                <div className="text-sm text-gray-400">
                  No containers found
                </div>
              )}
            </div>
          </div>

          {/* LEGEND */}
          <div className="bg-[rgba(255,255,255,0.02)] rounded-2xl p-4">
            <div className="text-sm font-medium text-gray-200">Legend</div>
            <div className="mt-3 flex flex-col gap-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS.cpu }}
                />{" "}
                CPU %
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS.mem }}
                />{" "}
                Memory %
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS.net }}
                />{" "}
                Network KB/s
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: COLORS.disk }}
                />{" "}
                Disk KB/s
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
};

export default StatsDashboard;
