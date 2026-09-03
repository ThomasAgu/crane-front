'use client'

import React, { FC, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import type { AppDto } from "@/lib/dto/AppDto";
import { AppService } from "@/lib/api/appService";
import { useSearchParams } from "next/navigation";
import NavBar from '../../../components/layout/NavBar'
import AppBase from "./AppBase";
import { StatsPanel } from "./StatsPanel";
import LogsPanel from "./LogsPanel";
import AlertsPanel from "./AlertsPanel";
import styles from '../home.module.css'
import { GeneralPanel } from "./GeneralPanel";

const AppDetailView: FC = () => {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "unknown";
  const appId = params?.id ?? "";

  const [appStatus, setAppStatus] = useState<string>(status === 'Running' ? "Activo": "Inactivo");
  const [app, setApp] = useState<AppDto>({} as AppDto);
  const [logs, setLogs] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"general" | "stats" | "logs" | "alertas">("general");
  const [isTemplate, setIsTemplate] = useState<boolean>(false);

    const fetchApp = useCallback(async () => {
    const res = await AppService.get(appId);
    setIsTemplate(res?.is_template);
    setApp(res ?? {} as AppDto);
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
  }, [activeTab, fetchLogs]);

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

  if (loading) return <div className="min-h-screen bg-[var(--background)] p-8 text-slate-500">Cargando aplicación...</div>;

  return (
    <NavBar>
      <div className={styles.homeDetailPage} >
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm">
          <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "general" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setActiveTab("general")}>General</button>
          {!isTemplate && (
            <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "stats" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setActiveTab("stats")}>Stats</button>
          )}
          {!isTemplate && (
              <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "logs" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setActiveTab("logs")}>Logs</button>
          )}
          {!isTemplate && (
            <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${activeTab === "alertas" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`} onClick={() => setActiveTab("alertas")}>Alertas</button>
          )}
        </div>

        <AppBase app={app} appStatus={appStatus} onAppAction={onAppAction} />
        {activeTab === "general" && <GeneralPanel app={app} appStatus={appStatus} />}
        {activeTab === "stats" && <StatsPanel appId={appId} appStatus={appStatus} />}
        {activeTab === "logs" && <LogsPanel logs={logs} onRefresh={fetchLogs} appStatus={appStatus} />}
        {activeTab === "alertas" && <AlertsPanel appId={appId} />}
      </div>
    </NavBar>
  );
};

export default AppDetailView;