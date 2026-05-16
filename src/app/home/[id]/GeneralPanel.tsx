import React, { FC } from "react";
import { AppDto } from "@/lib/dto/AppDto";

// Helper to format dates cleanly
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

export const GeneralPanel: FC<{ app: AppDto; appStatus: string }> = ({ app, appStatus }) => {
  return (
    <div className="pl-6 text-slate-800 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nombre de la aplicación</label>
            <p className="text-lg font-medium">{app.name}</p>
          </div>

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
        </section>

          {/* Timestamps */}
        <section className="space-y-4 bg-slate-50 p-4 rounded-md">
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

      <hr className="my-8 text-gray-200" />
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Servicios ({app.services.length})</h3>
          <div className="bg-slate-50 rounded border border-slate-200">
            {app.services.map((service, index) => (
              <div key={index} className="p-3 border-b last:border-b-0 flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-blue-600">{service.name}</span>
                  <span className="ml-3 text-sm text-slate-500">Image: {service.image}</span>
                </div>
                <div className="flex gap-1">
                  {service.networks?.map(net => (
                    <span key={net} className="bg-slate-200 text-[10px] px-2 py-0.5 rounded-full">{net}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Hosts</h3>
          <ul className="list-disc list-inside space-y-1">
            {app.hosts?.map((host: any, index) => (
              <li key={index} className="text-blue-500 hover:underline cursor-default font-mono text-sm">
                {host}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};