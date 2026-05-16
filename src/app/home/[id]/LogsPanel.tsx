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
    <div className="flex flex-col ml-4 h-full space-y-3 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="text-gray-300 font-semibold flex items-center gap-2">
          <span 
            className={`w-2 h-2 rounded-full ${
              appStatus === "Activo" ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></span>
          Logs {appStatus === "Inactivo" && <span className="text-xs font-normal opacity-50">(Pausados)</span>}
        </h3>
      </div>

      <div 
        ref={scrollRef}
        className="bg-black text-gray-200 p-4 rounded border border-gray-800 font-mono text-xs leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap"
      >
        {appStatus === "Activo" ? (
          logs ? <Ansi useClasses={true}>{logs}</Ansi> : <span className="text-gray-500 italic">Esperando por logs...</span>
        ) : (
          <span className="text-gray-400 italic font-sans text-center block">
            El servicio está inactivo. Inicia la aplicación para ver los logs.
          </span>
        )}
      </div>
      
      <div className="text-[10px] text-gray-500 text-right">
        {appStatus === "Activo" ? "Actualización cada 5 segundos" : "Auto-refresh desactivado"}
      </div>
    </div>
  );
};

export default LogsPanel;