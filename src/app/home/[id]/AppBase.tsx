import React, { FC } from "react";
import type { AppDto } from "@/lib/dto/AppDto";
import AppHostLinks from "@/components/ui/AppHostLinks";
import { FlaskConical } from "lucide-react";

type Props = {
  app: AppDto;
  appStatus: string;
  onAppAction: (action: "start" | "stop" | "restart" | "scaleUp" ) => Promise<void>;
  onOpenLaboratory: () => void;
};

const AppBase: FC<Props> = ({ app, appStatus, onAppAction, onOpenLaboratory }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-blue-50 p-6 shadow-sm">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{app?.name ?? "Untitled App"}</h1>
          <div className="mt-2 text-sm text-slate-500">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${appStatus === "Activo" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {app.is_template ? "Plantilla" : appStatus}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-200"
            onClick={onOpenLaboratory}
          >
            <FlaskConical size={16} />
            Laboratorio
          </button>
          { appStatus === "Inactivo" && !app.is_template && <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" onClick={() => onAppAction("start")}>Iniciar</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-200" onClick={() => onAppAction("stop")}>Detener</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200" onClick={() => onAppAction("restart")}>Reiniciar</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200" onClick={() => onAppAction("scaleUp")}>Escalar</button>} 
        </div>
      </header>
      <section className="mt-5 border-t border-slate-200 pt-4">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Accesos a servicios</h2>
        <AppHostLinks hosts={app.hosts} />
      </section>
        <hr className="mt-6 border-slate-200" />
    </div>
  );
};

export default AppBase;