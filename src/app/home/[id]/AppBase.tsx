import React, { FC } from "react";
import type { AppDto } from "@/src/lib/dto/AppDto";

type Props = {
  app: AppDto | null;
  appStatus: String;
  onAppAction: (action: "start" | "stop" | "restart" | "scaleUp" ) => Promise<void>;
};

const AppBase: FC<Props> = ({ app, appStatus, onAppAction }) => {
  return (
    <div className="mb-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-darkest">{app?.name ?? "Untitled App"}</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${appStatus === "Activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {appStatus ?? "unknown"}
            </span>
            <span className="ml-3 text-xs text-gray-500">Servicios: {app?.services?.length ?? 0}</span>
          </div>
        </div>

        <div className="flex gap-2">
          { appStatus === "Inactivo" && <button className="px-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition" onClick={() => onAppAction("start")}>Iniciar</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition" onClick={() => onAppAction("stop")}>Detener</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-green-100  text-green-700 hover:bg-green-200 transition" onClick={() => onAppAction("restart")}>Reiniciar</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition" onClick={() => onAppAction("scaleUp")}>Escalar</button>}
          
        </div>
      </header>

      <section className="mt-4 grid gap-3">
        {(app?.services ?? []).map((svc) => (
          <div key={svc.name} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm text-primary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-sm font-medium border">{svc.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <div className="font-bold">{svc.name}</div>
                <div className="text-xs text-gray-500">{svc.image}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AppBase;