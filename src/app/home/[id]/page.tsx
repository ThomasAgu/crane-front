'use client'

import React, { FC, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { AppDto } from "@/src/lib/dto/AppDto";
import { AppService } from "@/src/lib/api/appService";
import { useSearchParams } from "next/navigation";
import NavBar from '../../../components/layout/NavBar'
import AppBase from "./AppBase";
import StatsPanel from "./StatsPanel";
import LogsPanel from "./LogsPanel";
import AlertsPanel from "./AlertsPanel";
import styles from '../home.module.css'

const AppDetailView: FC = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "unknown";
  const appId = params?.id ?? "";

  const [appStatus, setAppStatus] = useState<String>(status === 'Running' ? "Activo": "Inactivo");
  const [app, setApp] = useState<AppDto | null>(null);
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"services" | "stats" | "logs" | "alertas">("services");

  const fetchApp = useCallback(async () => {
    const res = await AppService.get(appId);
    setApp(res ?? null);
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
          <button className={`px-4 py-2 ${activeTab === "alertas" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => setActiveTab("alertas")}>Alertas</button>
        </div>

        <AppBase app={app} appStatus={appStatus} onAppAction={onAppAction} />
        {activeTab === "services" && (<div className="p-4 text-black">Aquí iría el panel de servicios (no implementado aún)</div>)}
        {activeTab === "stats" && <StatsPanel appId={appId} />}
        {activeTab === "logs" && <LogsPanel logs={logs} onRefresh={fetchLogs} />}
        {activeTab === "alertas" && <AlertsPanel appId={appId} />}
      </div>
    </NavBar>
  );
};

export default AppDetailView;