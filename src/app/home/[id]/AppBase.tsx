import React, { FC } from "react";
import type { AppDto } from "@/lib/dto/AppDto";

type Props = {
  app: AppDto;
  appStatus: string;
  onAppAction: (action: "start" | "stop" | "restart" | "scaleUp" ) => Promise<void>;
};

const AppBase: FC<Props> = ({ app, appStatus, onAppAction }) => {
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
          { appStatus === "Inactivo" && !app.is_template && <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" onClick={() => onAppAction("start")}>Iniciar</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-200" onClick={() => onAppAction("stop")}>Detener</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200" onClick={() => onAppAction("restart")}>Reiniciar</button>}
          { appStatus === "Activo" && !app.is_template && <button className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200" onClick={() => onAppAction("scaleUp")}>Escalar</button>} 
        </div>
      </header>
        <hr className="mt-6 border-slate-200" />
    </div>
  );
};

export default AppBase;