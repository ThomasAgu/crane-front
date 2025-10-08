import React from "react";
import { Layers, Database, Boxes } from "lucide-react";


interface TemplateItemProps {
  title: string;
  description: string;
  services: number;
  rules: number;
  icon: React.ReactNode;
  onClick: () => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({
  title,
  description,
  services,
  rules,
  icon,
  onClick 
}) => {
  return (
    <div  onClick={onClick} className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-blue-600 text-white flex flex-col items-center justify-center h-32">
        <div className="text-5xl mb-2">{icon}</div>
      </div>

      <div className="p-4">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <div className="flex justify-between text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <span>Servicios iniciales</span>
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {services}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Reglas iniciales</span>
            <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs">
              {rules}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateItem;
