import React, { FC } from "react";
import { AppDto } from "@/lib/dto/AppDto";
import ServiceCard from "@/components/ui/ServiceCard";
import NetworkList from "@/components/ui/NetworkList";
import EnvironmentVariables from "@/components/ui/EnvironmentVariables";

// Helper to format dates cleanly
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

export const GeneralPanel: FC<{ app: AppDto; appStatus: string }> = ({ app, appStatus }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[var(--surface)] p-6 text-slate-800 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nombre de la aplicación</label>
            <p className="text-lg font-medium">{app.name}</p>
          </div>
          {app.is_template && (
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tipo</label>
              <p className="text-md">Plantilla</p>
            </div>
          )}
          {!app.is_template && (
            <>
              <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estado</label>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded text-xs font-bold ${appStatus === "Activo" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {appStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Escalado</label>
              <p className="text-md">
                Actual: <span className="font-bold">{app.current_scale}</span> 
                <span className="text-slate-400 mx-2">|</span>
                Rango: {app.min_scale} - {app.max_scale}
              </p>
            </div>
          </>
          )}
          
        </section>

          {/* Timestamps */}
        <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 italic">Creado el</label>
            <p className="text-sm">{formatDate(app.created_at)}</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 italic">Última actualización</label>
            <p className="text-sm">{formatDate(app.updated_at)}</p>
          </div>
        </section>
      </div>

      <hr className="my-8 border-slate-200" />
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Servicios ({app.services.length})</h3>
          <div className="grid grid-cols-1 gap-4">
            {app.services.map((service, index) => <ServiceCard key={`${service.name}-${index}`} service={service} index={index} />)}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Redes</h3>
          <NetworkList networks={app.services.flatMap((service) => service.networks ?? [])} services={app.services} />
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Hosts</h3>
          <ul className="list-disc list-inside space-y-1">
            {app.hosts?.map((host: any, index) => (
              <li key={index} className="text-blue-500 hover:underline cursor-default font-mono text-sm">
                {host}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Variables de entorno</h3>
          <EnvironmentVariables variables={app.environment} />
        </div>
      </div>
    </div>
  );
};