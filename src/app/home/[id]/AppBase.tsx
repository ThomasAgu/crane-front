import React, { FC, useState } from "react";
import type { AppDto } from "@/lib/dto/AppDto";
import AppHostLinks from "@/components/ui/AppHostLinks";
import { FlaskConical, Layers2, LoaderCircle, Pause, Play, RefreshCcw, Trash } from "lucide-react";
import { AlertSnackbar, useAlert } from "@/components/ui/AlertSnackbar";

type AppAction = "start" | "stop" | "restart" | "scaleUp";

type Props = {
  app: AppDto;
  appStatus: string;
  onAppAction: (action: AppAction) => Promise<void>;
  onOpenLaboratory: () => void;
  onDeleteRequest: () => void;
};

const AppBase: FC<Props> = ({ app, appStatus, onAppAction, onOpenLaboratory, onDeleteRequest }) => {
  const [loadingAction, setLoadingAction] = useState<AppAction | null>(null);
  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const handleAppAction = async (action: AppAction) => {
    if (loadingAction) return;
    setLoadingAction(action);
    try {
      await onAppAction(action);
      const actionMessages: Record<AppAction, { message: string; title: string }> = {
        start: { message: "La aplicación ha sido iniciada.", title: "Aplicación Iniciada" },
        stop: { message: "La aplicación ha sido detenida.", title: "Aplicación Detenida" },
        restart: { message: "La aplicación ha sido reiniciada.", title: "Aplicación Reiniciada" },
        scaleUp: { message: "La aplicación ha sido escalada.", title: "Aplicación Escalada" },
      };
      showAlert(actionMessages[action].message, "success", actionMessages[action].title);
    } catch (error) {
      showAlert(
        error instanceof Error ? error.message : "Ocurrió un error al procesar la acción.",
        "error",
        "No se pudo completar la acción"
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const renderActionButton = (action: AppAction, label: string, icon: React.ReactNode, className: string) => (
    <button
      key={action}
      type="button"
      aria-busy={loadingAction === action}
      disabled={loadingAction !== null}
      className={`${className} inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
      onClick={() => void handleAppAction(action)}
    >
      {loadingAction === action
        ? <LoaderCircle aria-hidden="true" size={16} className="animate-spin" />
        : icon}
      {loadingAction === action ? `${label}...` : label}
    </button>
  );

  return (
    <div className="relative mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{app?.name ?? "Untitled App"}</h1>
          <div className="mt-2 text-sm text-slate-500">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${appStatus === "Activo" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {app.is_template ? "Plantilla" : appStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200 cursor-pointer"
            onClick={onOpenLaboratory}
          >
            <FlaskConical size={16} />
            Laboratorio
          </button>
          {appStatus === "Inactivo" && !app.is_template && renderActionButton("start", "Iniciar", <Play aria-hidden="true" size={16} />, "rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 cursor-pointer")}
          {appStatus === "Activo" && !app.is_template && renderActionButton("stop", "Detener", <Pause aria-hidden="true" size={16} />, "rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-200 cursor-pointer")}
          {appStatus === "Activo" && !app.is_template && renderActionButton("restart", "Reiniciar", <RefreshCcw aria-hidden="true" size={16} />, "rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 cursor-pointer")}
          {appStatus === "Activo" && !app.is_template && renderActionButton("scaleUp", "Escalar", <Layers2 aria-hidden="true" size={16} />, "rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200 cursor-pointer")}
          <button
            type="button"
            disabled={loadingAction !== null}
            onClick={onDeleteRequest}
            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            <Trash aria-hidden="true" size={16} />
            Borrar
          </button>
        </div>
      </header>
      <section className="mt-5 border-t border-slate-200 pt-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Accesos a servicios</h2>
        <AppHostLinks hosts={app.hosts} />
      </section>
        <hr className="mt-6 border-slate-200" />
      <AlertSnackbar alertState={alertState} handleCloseAlert={handleCloseAlert} />
    </div>
  );
};

export default AppBase;