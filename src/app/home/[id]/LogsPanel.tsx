import React, { FC } from "react";

type Props = {
  logs: string;
  onRefresh: () => Promise<void>;
};

const LogsPanel: FC<Props> = ({ logs, onRefresh }) => {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button onClick={onRefresh} className="px-3 py-1 bg-blue-600 text-white rounded">Refresh</button>
      </div>
      <div className="bg-black text-white p-3 rounded font-mono text-sm max-h-[60vh] overflow-auto">
        {logs || "No logs available"}
      </div>
    </div>
  );
};

export default LogsPanel;