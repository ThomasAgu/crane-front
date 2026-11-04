'use client';

import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BellRing,
  CheckCircle2,
  Clock3,
  Inbox,
  Server,
} from "lucide-react";
import { ReportService } from "@/lib/api/reportService";
import { AlertDto, AlertReportDto } from "@/lib/dto/AlertReportDto";
import { TimeRange } from "@/lib/types/TimeRange";
import Loader from "@/components/ui/Loader";

interface AlertIncident {
  firing?: AlertDto;
  resolved?: AlertDto;
}

interface AlertGroup {
  key: string;
  name: string;
  severity: string;
  instance?: string;
  job?: string;
  status: AlertDto["status"];
  latestTimestamp: string;
  incidents: AlertIncident[];
}

const getAlertName = (alert: AlertDto) => {
  if (alert.alert_name) return alert.alert_name;
  const labelName = alert.labels.alertname;
  return typeof labelName === "string" && labelName ? labelName : "Alerta sin nombre";
};

const compareByTimestamp = (a: AlertDto, b: AlertDto) => {
  const difference = Date.parse(a.timestamp) - Date.parse(b.timestamp);
  return (Number.isNaN(difference) ? 0 : difference) || a.id - b.id;
};

const getAlertIdentity = (alert: AlertDto) => {
  if (alert.fingerprint) return `${getAlertName(alert)}:${alert.fingerprint}`;

  const labels = Object.entries(alert.labels)
    .sort(([left], [right]) => left.localeCompare(right));
  return JSON.stringify([getAlertName(alert), alert.severity, labels]);
};

const buildAlertGroups = (alerts: AlertDto[]): AlertGroup[] => {
  const groups = new Map<string, AlertDto[]>();

  alerts.forEach((alert) => {
    const key = getAlertIdentity(alert);
    const groupAlerts = groups.get(key) ?? [];
    groupAlerts.push(alert);
    groups.set(key, groupAlerts);
  });

  return Array.from(groups.entries()).map(([key, groupAlerts]) => {
    const events = [...groupAlerts].sort(compareByTimestamp);
    const latestAlert = events[events.length - 1];
    const incidents: AlertIncident[] = [];
    let openIncident: AlertIncident | undefined;

    events.forEach((event) => {
      if (event.status === "firing") {
        if (!openIncident) {
          openIncident = { firing: event };
          incidents.push(openIncident);
        }
      } else if (openIncident) {
        openIncident.resolved = event;
        openIncident = undefined;
      } else {
        incidents.push({ resolved: event });
      }
    });

    return {
      key,
      name: getAlertName(latestAlert),
      severity: latestAlert.severity,
      instance: latestAlert.labels.instance?.toString(),
      job: latestAlert.labels.job?.toString(),
      status: latestAlert.status,
      latestTimestamp: latestAlert.timestamp,
      incidents: incidents.reverse(),
    };
  }).sort((a, b) => {
    if (a.status !== b.status) return a.status === "firing" ? -1 : 1;
    const difference = Date.parse(b.latestTimestamp) - Date.parse(a.latestTimestamp);
    return Number.isNaN(difference) ? 0 : difference;
  });
};

export const AlertDashboard: FC<{ appId: string; timeRange: TimeRange }> = ({
  appId,
  timeRange,
}) => {
  const [alertData, setAlertData] = useState<AlertReportDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ReportService.getAlerts(appId, timeRange);
        setAlertData(data);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "No se pudieron cargar las alertas.");
        console.error("Failed to fetch alerts:", fetchError);
      } finally {
        setLoading(false);
      }
    };

    void fetchAlerts();
    const intervalId = timeRange === "0" ? setInterval(fetchAlerts, 10000) : undefined;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appId, timeRange]);

  const groupedAlerts = useMemo(
    () => buildAlertGroups(alertData?.alerts ?? []),
    [alertData],
  );
  const activeCount = groupedAlerts.filter((group) => group.status === "firing").length;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="relative flex h-full min-h-[360px] max-h-[560px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
              <BellRing size={19} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Historial de alertas</h2>
              <p className="mt-0.5 text-xs text-slate-500">Incidentes y cambios de estado</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{alertData?.summary.total ?? 0}</span> eventos
            </div>
            <div className={`rounded-lg border px-3 py-1.5 text-xs ${
              activeCount > 0
                ? "border-red-100 bg-red-50 text-red-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}>
              <span className="font-semibold">{activeCount}</span> activas
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div role="alert" className="mx-5 mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {loading && !alertData ? (
          <div className="flex h-full min-h-48 items-center justify-center">
            <Loader loading={loading} width={42} height={42} />
          </div>
        ) : groupedAlerts.length === 0 ? (
          <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
            {error ? (
              <>
                <AlertCircle size={36} className="mb-3 text-red-300" strokeWidth={1.5} />
                <p className="text-sm font-medium text-slate-700">No se pudo cargar el historial</p>
                <p className="mt-1 text-xs text-slate-500">Inténtalo de nuevo en unos momentos.</p>
              </>
            ) : (
              <>
                <Inbox size={38} className="mb-3 text-slate-300" strokeWidth={1.5} />
                <p className="text-sm font-medium text-slate-700">Sin alertas en este período</p>
                <p className="mt-1 text-xs text-slate-500">Los incidentes aparecerán aquí cuando se detecten.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedAlerts.map((group) => (
              <article
                key={group.key}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={`mt-0.5 rounded-lg p-2 ${
                      group.status === "firing"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      {group.status === "firing" ? <Activity size={17} /> : <CheckCircle2 size={17} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{group.name}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {group.instance && (
                          <span className="inline-flex items-center gap-1">
                            <Server size={13} />
                            <span className="font-mono">{group.instance}</span>
                          </span>
                        )}
                        {group.job && <span>Job: <span className="font-medium text-slate-700">{group.job}</span></span>}
                        <span className="capitalize">{group.severity}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    group.status === "firing"
                      ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                      : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                  }`}>
                    {group.status === "firing" ? "Activa" : "Resuelta"}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {group.incidents.length} {group.incidents.length === 1 ? "incidente" : "incidentes"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Último cambio: {formatDate(group.latestTimestamp)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {group.incidents.map((incident, index) => {
                      const currentlyFiring = Boolean(incident.firing && !incident.resolved);
                      const onlyResolved = !incident.firing && Boolean(incident.resolved);
                      return (
                        <div
                          key={`${incident.firing?.id ?? "prior"}-${incident.resolved?.id ?? "open"}`}
                          className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg bg-slate-50 px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            {currentlyFiring ? (
                              <Activity size={14} className="text-red-500" />
                            ) : (
                              <CheckCircle2 size={14} className="text-emerald-600" />
                            )}
                            <span className="font-medium text-slate-700">
                              Incidente {group.incidents.length - index}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              currentlyFiring
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {currentlyFiring ? "En curso" : onlyResolved ? "Resuelta · inició antes del período" : "Resuelta"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            {incident.firing && (
                              <span className="inline-flex items-center gap-1">
                                <Clock3 size={12} />
                                Inicio {formatDate(incident.firing.timestamp)}
                              </span>
                            )}
                            {incident.resolved && (
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Fin {formatDate(incident.resolved.timestamp)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {loading && alertData && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <Loader loading={loading} width={42} height={42} />
        </div>
      )}
    </section>
  );
};
