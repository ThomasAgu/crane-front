import React, { FC } from "react";
import { COLORS, fmt } from "./statsUtils";
import { ContainerStatsDto } from "@/src/lib/dto/ContainerStats";
import Loader from "@/src/components/ui/Loader";

interface RealtimeDashboardProps {
  data: ContainerStatsDto[] | null;
  loading: boolean;
}

/**
 * Real-time Dashboard Component
 * Displays current container stats (when timeRange is 0)
 */
export const RealtimeDashboard: FC<RealtimeDashboardProps> = ({ data, loading }) => {
  if (loading && !data) {
    return (
      <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl text-gray-300 mb-4">Cargando estadísticas en tiempo real...</div>
          <Loader loading={loading} width={50} height={50}/>
        </div>
      </div>
    );
  }

  if (!data || data?.length === 0) {
    return (
      <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-8 shadow-sm border border-[rgba(255,255,255,0.05)] flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-2xl text-gray-400 font-semibold">La aplicación no está ejecutándose</div>
          <div className="text-lg text-gray-500 mt-2">No se pudo conectar con ningún contenedor</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Containers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data?.map((container) => {
          const memoryPercentage = (container.memory_used / container.memory_limit) * 100;
          
          return (
            <div
              key={container.container_id}
              className="bg-[rgba(255,255,255,0.2)] rounded-lg p-4 border border-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.1)] transition"
            >
              {/* Container Name */}
              <div className="mb-4">
                <div className="text-md font-semibold text-gray-400 truncate">
                  {container.container_name}
                </div>
                <div className="text-xs text-gray-600 font-mono truncate">
                  {container.container.substring(0, 12)}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="space-y-3">
                {/* CPU */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS.cpu }}
                    />
                    <span className="text-sm text-gray-400">CPU</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-200">
                    {fmt(container.cpu_percentage, 2)}%
                  </span>
                </div>

                {/* Memory */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS.mem }}
                    />
                    <span className="text-sm text-gray-400">Memoria</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500">
                      {fmt(container.memory_used / 1024 / 1024, 0)} MB
                    </span>
                    <span className="text-sm font-semibold text-gray-200">
                      {fmt(memoryPercentage, 1)}%
                    </span>
                  </div>
                </div>

                {/* Disk I/O */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS.disk }}
                    />
                    <span className="text-sm text-gray-400">Disco</span>
                  </div>
                  <span className="text-sm text-gray-400 space-x-1">
                    <span className="font-semibold text-gray-200">
                      {fmt(container.block_read / 1024, 0)} / {fmt(container.block_write / 1024, 0)}
                    </span>
                    <span>KB</span>
                  </span>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS.net }}
                    />
                    <span className="text-sm text-gray-400">Red</span>
                  </div>
                  <span className="text-sm text-gray-400 space-x-1">
                    <span className="font-semibold text-gray-200">
                      ↑ {fmt(container.net_upload, 0)} / ↓ {fmt(container.net_download, 0)}
                    </span>
                    <span>B</span>
                  </span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mt-4 space-y-2">
                {/* CPU Progress */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min(container.cpu_percentage, 100)}%`,
                        backgroundColor: COLORS.cpu,
                      }}
                    />
                  </div>
                </div>
                {/* Memory Progress */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-[rgba(255,255,255,0.05)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${Math.min(memoryPercentage, 100)}%`,
                        backgroundColor: COLORS.mem,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RealtimeDashboard;
