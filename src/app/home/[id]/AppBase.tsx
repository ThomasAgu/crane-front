import React, { FC } from "react";
import type { AppDto } from "@/src/lib/dto/AppDto";

type Props = {
  app: AppDto | null;
  appStatus: String;
  onAppAction: (action: "start" | "stop" | "restart" | "scaleUp" ) => Promise<void>;
};

const AppBase: FC<Props> = ({ app, appStatus, onAppAction }) => {
  return (
    <div className="ml-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-darkest">{app?.name ?? "Untitled App"}</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${appStatus === "Activo" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {appStatus ?? "unknown"}
            </span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          { appStatus === "Inactivo" && <button className="px-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition" onClick={() => onAppAction("start")}>Iniciar</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition" onClick={() => onAppAction("stop")}>Detener</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-green-100  text-green-700 hover:bg-green-200 transition" onClick={() => onAppAction("restart")}>Reiniciar</button>}
          { appStatus === "Activo" && <button className="px-3 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition" onClick={() => onAppAction("scaleUp")}>Escalar</button>}
          
        </div>
      </header>
        <hr className="my-6 border-gray-200" />
    </div>
  );
};

export default AppBase;