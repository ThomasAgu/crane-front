'use client'

import React, { FC, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { AppDto } from "@/src/lib/dto/AppDto";
import type { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";
import { getApp, getLogs, getStats, startApp, stopApp, restartApp, scaleApp } from "@/src/lib/api/appService";
import AppBase from "./AppBase";
import StatsPanel from "./StatsPanel";
import LogsPanel from "./LogsPanel";

type HistItem = {
  container_id: string;
  container_name: string;
  series: number[];
  latest: ContainerStatsDto;
};

const MAX_HISTORY = 20;

const AppDetailView: FC = () => {
  const params = useParams<{ id: string }>();
  const appId = params?.id ?? "";

  const [app, setApp] = useState<AppDto | null>(null);
  const [logs, setLogs] = useState<string>("");
  const [histories, setHistories] = useState<Record<string, HistItem>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"services" | "stats" | "logs">("services");

  const fetchApp = useCallback(async () => {
    const res = await getApp(appId);
    setApp(res ?? null);
  }, [appId]);

  const fetchStats = useCallback(async () => {
    const data = await getStats(appId);
    if (!Array.isArray(data)) return;
    setHistories((prev) => {
      const next = { ...prev };
      (data as ContainerStatsDto[]).forEach((s) => {
        const id = s.container_id;
        const name = s.container_name;
        const cpu = Number(s.cpu_percentage ?? 0);
        const prevItem = next[id] ?? { container_id: id, container_name: name, series: [], latest: s };
        const newSeries = [...(prevItem.series || []), cpu].slice(-MAX_HISTORY);
        next[id] = { container_id: id, container_name: name, series: newSeries, latest: s };
      });
      return next;
    });
  }, [appId]);

  const fetchLogs = useCallback(async () => {
    const l = await getLogs(appId);
    debugger
    setLogs(l ?? "");
  }, [appId]);

  useEffect(() => {
    if (!appId) return;
    setLoading(true);
    (async () => {
      await fetchApp();
      setLoading(false);
    })();
  }, [appId, fetchApp]);

  useEffect(() => {
    if (activeTab === "stats") {
      fetchStats();
      const id = setInterval(fetchStats, 5000);
      return () => clearInterval(id);
    }
  }, [activeTab, fetchStats]);

  useEffect(() => {
    if (activeTab === "logs") fetchLogs();
  }, [activeTab, fetchLogs]);

  const onAppAction = async (action: "start" | "stop" | "restart" | "scaleUp" | "scaleDown") => {
    try {
      if (action === "start") await startApp(appId);
      if (action === "stop") await stopApp(appId);
      if (action === "restart") await restartApp(appId);
      if (action === "scaleUp") await scaleApp(appId);
      await fetchApp();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 border-b">
        <button className={`px-4 py-2 ${activeTab === "services" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("services")}>Services</button>
        <button className={`px-4 py-2 ${activeTab === "stats" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("stats")}>Stats</button>
        <button className={`px-4 py-2 ${activeTab === "logs" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("logs")}>Logs</button>
      </div>

      <AppBase app={app} onAppAction={onAppAction} />

      {activeTab === "stats" && <StatsPanel histories={Object.values(histories)} />}

      {activeTab === "logs" && <LogsPanel logs={logs} onRefresh={fetchLogs} />}
    </div>
  );
};

export default AppDetailView;