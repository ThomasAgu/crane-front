'use client'

import React, { FC, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { AppDto } from "@/src/lib/dto/AppDto";
import type { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";
import { AppService } from "@/src/lib/api/appService";
import { useSearchParams } from "next/navigation";
import NavBar from '../../../components/layout/NavBar'
import AppBase from "./AppBase";
import StatsPanel from "./StatsPanel";
import LogsPanel from "./LogsPanel";
import styles from '../home.module.css'

type HistItem = {
  container_id: string;
  container_name: string;
  series: number[];
  latest: ContainerStatsDto;
};

const MAX_HISTORY = 20;

const AppDetailView: FC = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "unknown";
  const appId = params?.id ?? "";

  const [appStatus, setAppStatus] = useState<String>(status === 'Running' ? "Activo": "Inactivo");
  const [app, setApp] = useState<AppDto | null>(null);
  const [logs, setLogs] = useState<string>("");
  const [histories, setHistories] = useState<Record<string, HistItem>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"services" | "stats" | "logs">("services");

  const fetchApp = useCallback(async () => {
    const res = await AppService.get(appId);
    setApp(res ?? null);
  }, [appId]);

  const fetchStats = useCallback(async () => {
    const data = await AppService.getStats(appId);
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
    const l = await AppService.getLogs(appId);
    setLogs(l);
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
    if (activeTab === "logs") {
      fetchLogs();
    }
  }, [activeTab]);

  const onAppAction = async (action: "start" | "stop" | "restart" | "scaleUp" | "scaleDown") => {
    try {
      if (action === "start") {
        await AppService.start(appId);
        setAppStatus("Activo");
      }
      if (action === "stop") {
        await AppService.stop(appId);
        setAppStatus("Inactivo");
      }
      if (action === "restart") await AppService.restart(appId);
      if (action === "scaleUp") await AppService.scale(appId);
      await fetchApp();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <NavBar>
      <div className={styles.homeDetailPage} >
        <div className="flex gap-2 mb-4 border-b">
          <button className={`px-4 py-2 ${activeTab === "services" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("services")}>Services</button>
          <button className={`px-4 py-2 ${activeTab === "stats" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("stats")}>Stats</button>
          <button className={`px-4 py-2 ${activeTab === "logs" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("logs")}>Logs</button>
        </div>

        <AppBase app={app} appStatus={appStatus} onAppAction={onAppAction} />

        {activeTab === "stats" && <StatsPanel histories={Object.values(histories)} />}

        {activeTab === "logs" && <LogsPanel logs={logs} onRefresh={fetchLogs} />}
      </div>
    </NavBar>
  );
};

export default AppDetailView;