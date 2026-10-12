import React from "react";

interface TemplateItemProps {
  title: string;
  description: string;
  services: number;
  icon: React.ReactNode;
  isTemplate?: boolean;
  onClick: () => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({
  title,
  description,
  services,
  icon,
  isTemplate = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br bg-blue-700 text-white transition-colors group-hover:from-blue-700 group-hover:to-blue-800">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
          {icon}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {isTemplate && (
            <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-indigo-700">
              Plantilla
            </span>
          )}
        </div>
        <p className="mb-5 flex-1 text-sm leading-6 text-slate-500">{description}</p>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <span className="rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
            {services}
          </span>
          <span>{services === 1 ? "servicio inicial" : "servicios iniciales"}</span>
        </div>
      </div>
    </button>
  );
};

export default TemplateItem;
