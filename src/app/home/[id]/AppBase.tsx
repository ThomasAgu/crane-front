import React, { FC } from "react";
import type { AppDto } from "@/src/lib/dto/AppDto";
import type { ServiceDto } from "@/src/lib/dto/ServiceDto";

type Props = {
  app: AppDto | null;
  onAppAction: (action: "start" | "stop" | "restart" | "scaleUp" | "scaleDown") => Promise<void>;
};

const AppBase: FC<Props> = ({ app, onAppAction }) => {
  return (
    <div className="mb-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{app?.name ?? "Untitled App"}</h1>
          <div className="text-sm text-gray-500 mt-1">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${app?.status === "running" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
              {app?.status ?? "unknown"}
            </span>
            <span className="ml-3 text-xs text-gray-500">Services: {app?.services?.length ?? 0}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => onAppAction("start")}>Start App</button>
          <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => onAppAction("stop")}>Stop App</button>
          <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => onAppAction("restart")}>Restart App</button>
          <button className="px-3 py-1 bg-gray-100 border rounded" onClick={() => onAppAction("scaleDown")}>Scale −</button>
          <button className="px-3 py-1 bg-gray-100 border rounded" onClick={() => onAppAction("scaleUp")}>Scale +</button>
        </div>
      </header>

      <section className="mt-4 grid gap-3">
        {(app?.services ?? []).map((svc) => (
          <div key={svc.name} className="flex items-center justify-between p-3 bg-white border rounded shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-sm font-medium border">{svc.name?.charAt(0)?.toUpperCase()}</div>
              <div>
                <div className="font-medium">{svc.name}</div>
                <div className="text-xs text-gray-500">{svc.image}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 mr-2">instances</div>
              <div className="text-xs text-gray-500">status: unknown</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AppBase;