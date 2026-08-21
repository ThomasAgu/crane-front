"use client";
import { useEffect, useState } from "react";
import styles from "./TemplateSelector.module.css";
import TemplateItem from "./TemplateItem";
import { Columns3Cog } from "lucide-react";
import { AppDto } from "@/lib/dto/AppDto";
import Image from "next/image";
import goback from "../../public/goback.svg";
import { useRouter } from "next/navigation";
import { DEFAULT_TEMPLATES } from "@/lib/helper/TemplateListDefault";

interface TemplateSelectorProps {
  setPopUp: (value: boolean) => void;
  setSelectedTemplate: (value: string | null) => void;
  setSelectedApp: (value: AppDto | null) => void;
  apps: AppDto[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  setPopUp,
  setSelectedTemplate,
  setSelectedApp,
  apps,
}) => {
  const [appsTab, setAppsTab] = useState(true);
  const [appsList, setAppsList] = useState<AppDto[]>([]);
  const [templatesList, setTemplatesList] = useState<AppDto[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (apps.length === 0) {
      setAppsTab(false);
    } else {
      const templates = apps.filter((app) => app.is_template);
      const nonTemplates = apps.filter((app) => !app.is_template);
      setTemplatesList(templates);
      setAppsList(nonTemplates);
    }
  }, [apps]);

  const handleClickGoBackButton = () => {
    router.back();
  };

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
          <div className={styles.header}> 
            <button className={styles.GoBackButton} onClick={handleClickGoBackButton} aria-label="Volver a la página anterior"> 
              <Image
                src={goback}
                alt="Salir de laboratorio"
                width={30}
                height={30}
              />
            </button>
            <div className={styles.buttonGroup}>
              {appsList.length > 0 && (
                <button
                  className={appsTab ? styles.buttonActive : styles.buttonInactive}
                  onClick={() => setAppsTab(true)}
                >
                  Aplicaciones
                </button>
              )}
              <button
                className={!appsTab ? styles.buttonActive : styles.buttonInactive}
                onClick={() => setAppsTab(false)}
              >
                Plantillas
              </button>
            </div>
          </div>

          {/* Sección de Aplicaciones del Usuario */}
          <div
            className={`grid grid-cols-3 gap-4 ${
              appsTab ? styles.appsShowed : styles.appsHidden
            }`}
          >
            {appsList.map((app, index) => (
              <TemplateItem
                key={app.id || index}
                title={app.name}
                description="Todavia no hay"
                services={app.services?.length || 0}
                rules={0}
                icon={<Columns3Cog size={80} />}
                isTemplate={false}
                onClick={() => handleTemplateSelect("custom", app)}
              />
            ))}
          </div>

          {/* Sección de Plantillas (Predeterminadas + Dinámicas) */}
          <div
            className={`grid grid-cols-3 gap-4 ${
              !appsTab ? styles.templatesShowed : styles.templatesHidden
            }`}
          >
            {/* 1. Plantillas Predeterminadas */}
            {DEFAULT_TEMPLATES.map((item) => (
              <TemplateItem
                key={item.id}
                title={item.title}
                description={item.description}
                services={item.services}
                rules={item.rules}
                icon={item.icon}
                isTemplate={true}
                onClick={() => handleTemplateSelect(item.id)}
              />
            ))}

            {/* 2. Plantillas dinámicas provenientes del backend (apps.is_template = true) */}
            {templatesList.map((templateApp, index) => (
              <TemplateItem
                key={templateApp.id || `template-${index}`}
                title={templateApp.name}
                description="Plantilla personalizada"
                services={templateApp.services?.length || 0}
                rules={0}
                icon={<Columns3Cog size={80} />}
                isTemplate={true}
                onClick={() => handleTemplateSelect("custom", templateApp)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;