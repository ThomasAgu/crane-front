'use client';

import React, { FC, useEffect, useState, useMemo } from "react";
import { ReportService } from "@/src/lib/api/reportService";
import { AlertReportDto, AlertDto } from "@/src/lib/dto/AlertReportDto";
import { TimeRange } from "@/src/lib/types/TimeRange";
import Loader from "@/src/components/ui/Loader";
import { Inbox } from "lucide-react";

interface AlertGrouped {
  alert_name: string;
  severity: string;
  count: number;
  latestTimestamp: string;
  status: string;
  alerts: AlertDto[];
}

export const AlertDashboard: FC<{ appId: string; timeRange: TimeRange }> = ({
  appId,
  timeRange,
}) => {
  const [alertData, setAlertData] = useState<AlertReportDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await ReportService.getAlerts(appId, timeRange);
        setAlertData(data as AlertReportDto);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    let intervalId: NodeJS.Timeout | undefined;
    if (timeRange === "0") {
      intervalId = setInterval(fetchAlerts, 10000);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [appId, timeRange]);

  const groupedAlerts = useMemo(() => {
    if (!alertData?.alerts) return [];
    const groups = new Map<string, AlertGrouped>();

    alertData.alerts.forEach((alert) => {
      const key = `${alert.alert_name}-${alert.severity}`;
      if (!groups.has(key)) {
        groups.set(key, {
          alert_name: alert.alert_name,
          severity: alert.severity,
          count: 0,
          latestTimestamp: alert.timestamp,
          status: alert.status,
          alerts: [],
        });
      }
      const group = groups.get(key)!;
      group.count += 1;
      group.alerts.push(alert);
      if (new Date(alert.timestamp) > new Date(group.latestTimestamp)) {
        group.latestTimestamp = alert.timestamp;
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      const severityOrder: Record<string, number> = { critical: 0, page: 1 };
      return (severityOrder[a.severity] ?? 999) - (severityOrder[b.severity] ?? 999);
    });
  }, [alertData]);

  const formatFullDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit' }) + " " + 
           d.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden relative">
      {/* Header Estilo Dashboard */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Alertas</h2>
          {alertData?.summary && (
            <div className="flex gap-3">
              <div className="px-3 py-1 bg-white border rounded-full text-xs font-medium text-gray-500">
                Total: <span className="text-gray-900">{alertData.summary.total}</span>
              </div>
              <div className="px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-medium text-red-600">
                Activas: {alertData.summary.firing}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {groupedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-gray-400">
            <Inbox size={48} strokeWidth={1} className="mb-2 opacity-20" />
            <p className="text-sm font-light">No se detectaron alertas en este período</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedAlerts.map((group, idx) => (
              <div key={idx} className="relative pl-4 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-md font-bold text-gray-900 uppercase tracking-tight">
                      {group.alert_name.replace('_', ' ')}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        group.status === 'firing' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'
                      }`}>
                        {group.status === 'firing' ? '● ACTIVA' : '✓ RESUELTA'}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {group.alerts[0]?.labels.instance}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-800">{group.count}</span>
                    <p className="text-[10px] uppercase text-gray-400 font-bold">Ocurrencias</p>
                  </div>
                </div>

                {/* Historial de ocurrencias detallado */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Timeline de disparos</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {group.alerts.map((a, i) => (
                      <div key={i} className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-200/50 pb-1 last:border-0">
                        <span className="font-medium text-gray-500">#{group.alerts.length - i}</span>
                        <span className="font-mono">{formatFullDate(a.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && alertData && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-xl">
          <Loader loading={loading} width={30} height={30} />
        </div>
      )}
    </div>
  );
};