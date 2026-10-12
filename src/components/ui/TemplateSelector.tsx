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
import Loader from "./Loader";

interface TemplateSelectorProps {
  setPopUp: (value: boolean) => void;
  setSelectedTemplate: (value: string | null) => void;
  setSelectedApp: (value: AppDto | null) => void;
  setSelectedAppMode: (value: "edit" | "template" | null) => void;
  apps: AppDto[];
  loading: boolean;
  error: string | null;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  setPopUp,
  setSelectedTemplate,
  setSelectedApp,
  setSelectedAppMode,
  apps,
  loading,
  error,
}) => {
  const [appsTab, setAppsTab] = useState(false);
  const [appsList, setAppsList] = useState<AppDto[]>([]);
  const [templatesList, setTemplatesList] = useState<AppDto[]>([]);
  const router = useRouter();

  useEffect(() => {
    setTemplatesList(apps.filter((app) => app.is_template));
    setAppsList(apps.filter((app) => !app.is_template));
  }, [apps]);

  const handleTemplateSelect = (
    templateToLoad: string,
    app?: AppDto,
    mode: "edit" | "template" | null = null
  ) => {
    setSelectedApp(app ?? null);
    setSelectedAppMode(mode);
    setSelectedTemplate(templateToLoad);
    setPopUp(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} role="dialog" aria-modal="true" aria-labelledby="template-selector-title">
        <div className={styles.content}>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.GoBackButton}
              onClick={() => router.back()}
              aria-label="Volver a la página anterior"
            >
              <Image src={goback} alt="Salir de laboratorio" width={24} height={24} />
            </button>
            <div className={styles.heading}>
              <h1 id="template-selector-title">¿Qué quieres crear?</h1>
              <p>Elige un proyecto existente o empieza con una plantilla.</p>
            </div>
            <div className={styles.buttonGroup} role="tablist" aria-label="Opciones de proyecto">
              {(appsList.length > 0 || loading) && (
                <button
                  type="button"
                  role="tab"
                  aria-selected={appsTab}
                  className={appsTab ? styles.buttonActive : styles.buttonInactive}
                  onClick={() => setAppsTab(true)}
                >
                  Mis aplicaciones
                </button>
              )}
              <button
                type="button"
                role="tab"
                aria-selected={!appsTab}
                className={!appsTab ? styles.buttonActive : styles.buttonInactive}
                onClick={() => setAppsTab(false)}
              >
                Plantillas
              </button>
            </div>
          </div>

          {loading && (
            <div className={styles.loadingStatus} role="status" aria-live="polite">
              <Loader loading width={24} height={24} />
              <span>{apps.length ? "Actualizando tus proyectos..." : "Buscando tus proyectos..."}</span>
            </div>
          )}
          {error && (
            <div className={styles.errorStatus} role="alert">
              No se pudieron cargar tus proyectos: {error}
            </div>
          )}

          {appsTab ? (
            appsList.length > 0 ? (
              <div className={styles.grid}>
                {appsList.map((app) => (
                  <TemplateItem
                    key={app.id}
                    title={app.name}
                    description="Continúa trabajando en este proyecto."
                    services={app.services?.length || 0}
                    icon={<Columns3Cog size={36} />}
                    onClick={() => handleTemplateSelect("custom", app, "edit")}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Aún no tienes proyectos guardados.</p>
                <button type="button" onClick={() => setAppsTab(false)}>
                  Explorar plantillas
                </button>
              </div>
            )
          ) : (
            <div className={styles.grid}>
              {DEFAULT_TEMPLATES.map((item) => (
                <TemplateItem
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  services={item.services}
                  icon={item.icon}
                  isTemplate={true}
                  onClick={() => handleTemplateSelect(item.id)}
                />
              ))}

              {templatesList.map((templateApp) => (
                <TemplateItem
                  key={templateApp.id}
                  title={templateApp.name}
                  description="Plantilla personalizada"
                  services={templateApp.services?.length || 0}
                  icon={<Columns3Cog size={36} />}
                  isTemplate={true}
                  onClick={() => handleTemplateSelect("custom", templateApp, "template")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
