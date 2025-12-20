"use client";
import { useState } from "react";
import styles from "./TemplateSelector.module.css";
import TemplateItem from "./TemplateItem";
import { Database, Boxes, Layers, Square, Columns3Cog } from "lucide-react";
import { AppDto } from "@/src/lib/dto/AppDto";

interface TemplateSelectorProps {
  setPopUp: Function;
  setSelectedTemplate: Function;
  setSelectedApp: Function;
  apps: AppDto[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  setPopUp,
  setSelectedTemplate,
  setSelectedApp,
  apps,
}) => {
  const [appsTab, setAppsTab] = useState(true);

  const handleTemplateSelect = (templateToLoad: string, app?: AppDto) => {
    if (app) {
      setSelectedApp(app);
    }
    setSelectedTemplate(templateToLoad);
    setPopUp(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.content}>
          <div className={styles.buttonGroup}>
            <button
              className={`${
                appsTab ? styles.buttonActive : styles.buttonInactive
              }`}
              onClick={() => setAppsTab(true)}
            >
              Aplicaciones
            </button>
            <button
              className={`${
                !appsTab ? styles.buttonActive : styles.buttonInactive
              }`}
              onClick={() => setAppsTab(false)}
            >
              Plantillas
            </button>
          </div>
          <div
            className={`grid grid-cols-3 gap-4 ${
              appsTab ? styles.appsShowed : styles.appsHidden
            }`}
          >
            {apps.length > 0 ? (
              apps.map((app: AppDto, index: number) => {
                return (
                  <TemplateItem
                    key={index}
                    title={app.name}
                    description="Todavia no hay"
                    services={app.services?.length || 0}
                    rules={0}
                    icon={<Columns3Cog size={80} />}
                    onClick={() => handleTemplateSelect("custom", app)}
                  />
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div
            className={`grid grid-cols-3 gap-4 ${
              !appsTab ? styles.templatesShowed : styles.templatesHidden
            }`}
          >
            <TemplateItem
              title="Aplicación en blanco"
              description="Un modelo que te desafía a arrancar desde cero"
              services={0}
              rules={0}
              icon={<Square size={80} />}
              onClick={() => handleTemplateSelect("blank")}
            />
            <TemplateItem
              title="Microservicios"
              description="API REST y Base de datos SQL"
              services={2}
              rules={4}
              icon={<Layers size={80} />}
              onClick={() => handleTemplateSelect("microservices")}
            />
            <TemplateItem
              title="Base de datos"
              description="Arranca con un servicio de base de datos preseleccionado"
              services={1}
              rules={0}
              icon={<Database size={80} />}
              onClick={() => handleTemplateSelect("database")}
            />
            <TemplateItem
              title="API REST simple"
              description="Node.js y Express para guardar datos"
              services={2}
              rules={4}
              icon={<Boxes size={80} />}
              onClick={() => handleTemplateSelect("simple-api")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
