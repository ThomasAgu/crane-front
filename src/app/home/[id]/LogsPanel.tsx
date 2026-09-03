import React, { FC, useEffect, useRef } from "react";
import Ansi from "ansi-to-react";

type Props = {
  logs: string;
  onRefresh: () => Promise<void>;
  appStatus: string;
};

const LogsPanel: FC<Props> = ({ logs, onRefresh, appStatus }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appStatus === "Inactivo") return;

    const interval = setInterval(() => {
      onRefresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [onRefresh, appStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="ml-0 flex h-full flex-col space-y-3 rounded-2xl border border-slate-200 bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
          <span 
            className={`w-2 h-2 rounded-full ${
              appStatus === "Activo" ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></span>
          Logs {appStatus === "Inactivo" && <span className="text-xs font-normal text-slate-400">(Pausados)</span>}
        </h3>
      </div>

      <div 
        ref={scrollRef}
        className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200"
      >
        {appStatus === "Activo" ? (
          logs ? <Ansi useClasses={true}>{logs}</Ansi> : <span className="text-gray-500 italic">Esperando por logs...</span>
        ) : (
          <span className="text-gray-400 italic font-sans text-center block">
            El servicio está inactivo. Inicia la aplicación para ver los logs.
          </span>
        )}
      </div>
      
      <div className="text-right text-[10px] text-slate-400">
        {appStatus === "Activo" ? "Actualización cada 5 segundos" : "Auto-refresh desactivado"}
      </div>
    </div>
  );
};

export default LogsPanel;