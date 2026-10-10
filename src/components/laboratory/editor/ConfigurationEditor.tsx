"use client";
import React, { useState, useEffect } from "react";
import { editorService } from "@/app/services/EditorService";
import { getImageDetails } from "@/app/services/DockerHubService";
import { AppService } from "@/lib/api/appService";
import type { AppDto, CreateAppDto } from "@/lib/dto/AppDto";
import type { SelectedAppMode } from "@/hooks/useLaboratory";
import { validateAppConfiguration } from "@/lib/validators/AppConfigurationValidator";
import { useAlert, AlertSnackbar } from "../../ui/AlertSnackbar";
import styles from "./ConfigurationEditor.module.css";
import { FileText, Copy, Save, X } from "lucide-react";
import CreationModal from "../CreationModal";

const ConfigurationEditor: React.FC<{
  appId?: number | null;
  isSaved: boolean;
  selectedApp?: AppDto | null;
  selectedAppMode: SelectedAppMode;
  isTemplateMode: boolean;
  onTemplateModeChange: (value: boolean) => void;
  onFocusEditorIssue: (nodeId: string, field: string) => void;
}> = ({
  appId,
  isSaved,
  selectedApp,
  selectedAppMode,
  isTemplateMode,
  onTemplateModeChange,
  onFocusEditorIssue,
}) => {
  const [showMakefile, setShowMakefile] = useState(false);
  const [makefileContent, setMakefileContent] = useState("");
  const [saveAsNewTemplate, setSaveAsNewTemplate] = useState(false);
  const [templateConversionLocked, setTemplateConversionLocked] = useState(false);
  const isTemplate =
    isSaved && !selectedApp?.is_template ? false : isTemplateMode;
  const isTemplateSource = Boolean(selectedApp?.is_template);
  const updateSourceTemplate =
    isTemplateSource && isTemplate && !saveAsNewTemplate;
  const shouldCreateNew =
    (!isSaved && !updateSourceTemplate) ||
    (isTemplateSource && isTemplate && saveAsNewTemplate);

  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const [isCreating, setIsCreating] = useState(false);

  const focusEditorField = (field: string, nodeId?: string) => {
    if (nodeId) onFocusEditorIssue(nodeId, field);
    window.setTimeout(() => {
      const element = document.querySelector<HTMLElement>(`[data-editor-field="${field}"]`);
      element?.focus();
    }, 75);
  };

  const prepareAndValidateApp = async (): Promise<(CreateAppDto & { __warnings: string[] }) | null> => {
    const payload = editorService.exportAppDto();
    const normalizedName = (name: string) => name.trim().replace(/\s/g, "").toLowerCase();

    if (
      isTemplateSource &&
      isTemplate &&
      saveAsNewTemplate &&
      selectedApp?.name &&
      normalizedName(payload.name) === normalizedName(selectedApp.name)
    ) {
      showAlert(
        "Para guardar una plantilla nueva, el nombre de la aplicación debe ser distinto al de la plantilla original.",
        "error",
        "Nombre de plantilla duplicado"
      );
      const appNode = editorService.getAppNode();
      if (appNode) focusEditorField("app-name", appNode.id);
      return null;
    }

    const alerts = editorService.getAlerts();
    const validation = validateAppConfiguration(payload, alerts);

    if (!validation.valid) {
      const { issue } = validation;
      showAlert(issue.message, "error", issue.title);

      const node = issue.serviceIndex !== undefined
        ? editorService.getServiceNodeByIndex(issue.serviceIndex)
        : issue.field?.startsWith("app-")
          ? editorService.getAppNode()
          : undefined;

      if (issue.field) {
        focusEditorField(issue.field, node?.id);
      }
      return null;
    }

    const services = payload.services ?? [];
    const imageDetails = await Promise.all(
      services.map(async (service, index) => ({
        index,
        details: await getImageDetails(service.image),
      }))
    );
    const invalidImage = imageDetails.find(({ details }) => !details);

    if (invalidImage) {
      showAlert(
        "Una o más imágenes no existen en Docker Hub. Selecciona una imagen válida.",
        "error",
        "Imagen Inválida"
      );
      const invalidImageNode = editorService.getServiceNodeByIndex(invalidImage.index);
      focusEditorField("service-image", invalidImageNode?.id);
      return null;
    }

    if (alerts.length > 0) payload.alerts = alerts;
    return { ...payload, __warnings: validation.warnings };
  };
  
  useEffect(() => {
    setSaveAsNewTemplate(false);
    setTemplateConversionLocked(false);
  }, [selectedApp?.id, selectedAppMode]);

  useEffect(() => {
    if (!showMakefile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMakefile(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showMakefile]);

  const handleCreateApp = async () => {
    const prepared = await prepareAndValidateApp();
    if (!prepared) return;
    const { __warnings, ...payload } = prepared;

    setIsCreating(true);
    try {
      payload["is_template"] = isTemplate;

      await AppService.create(payload);
      showAlert(
        __warnings.length ? `La aplicación se creó, pero revisa: ${__warnings.join(" ")}` : "La aplicación se ha creado con éxito.",
        __warnings.length ? "warning" : "success",
        __warnings.length ? "Creación con advertencias" : "Creación Exitosa"
      );
    } catch (err) {
      if (err instanceof Error && err.message.includes("App with this name already exists")) {
        showAlert("Ya tienes una aplicación con ese nombre. Por favor, elige un nombre diferente.", "error", "Nombre de Aplicación Duplicado");
      } else {
        showAlert(
          err instanceof Error ? err.message : "Hubo un error al intentar crear la aplicación.",
          "error",
          "Error en la Creación"
        );
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = () => {
    if (shouldCreateNew) {
      void handleCreateApp();
    } else {
      void handleUpdateApp();
    }
  };

  const handleUpdateApp = async () => {
    const prepared = await prepareAndValidateApp();
    if (!prepared) return;
    const { __warnings, ...payload } = prepared;
    const updateId = appId ?? selectedApp?.id;

    if (updateId === undefined || updateId === null) {
      showAlert("No se encontró la aplicación que se quiere actualizar.", "error", "Error en la Actualización");
      return;
    }

    setIsCreating(true);
    try {
      await AppService.update({
        ...payload,
        id: updateId,
        is_template: isTemplate,
      });
      showAlert(
        __warnings.length ? `La aplicación se actualizó, pero revisa: ${__warnings.join(" ")}` : "La aplicación se ha actualizado con éxito.",
        __warnings.length ? "warning" : "success",
        __warnings.length ? "Actualización con advertencias" : "Actualización Exitosa"
      );
    } catch (err) {
      showAlert(
        err instanceof Error ? err.message : "Hubo un error al intentar actualizar la aplicación.",
        "error",
        "Error en la Actualización"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleSeeMakefile = () => {
    const payload = editorService.exportAppDto();
    const mf = editorService.generateMakefileFromApp(payload);
    setMakefileContent(mf);
    setShowMakefile(true);
  };

  const handleCopyMakefile = async () => {
    try {
      const payload = editorService.exportAppDto();
      const mf = editorService.generateMakefileFromApp(payload);
      await navigator.clipboard.writeText(mf);
      showAlert(
        "El Makefile principal ha sido copiado al portapapeles.",
        "success",
        "Copiado Exitoso"
      );
    } catch (err) {
      console.error(err);
      showAlert(
        "No se pudo copiar el Makefile. Inténtalo de nuevo.",
        "error",
        "Error al Copiar"
      );
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Aplicación</h2>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isTemplate}
              disabled={
                isCreating ||
                templateConversionLocked ||
                isSaved
              }
              onChange={(event) => {
                if (isSaved) return;
                const checked = event.target.checked;
                onTemplateModeChange(checked);
                if (isTemplateSource && !checked) {
                  setTemplateConversionLocked(true);
                }
              }}
            />
            Guardar como plantilla
          </label>
          <p className={styles.templateNote}>
            {isTemplateSource && !isTemplate
              ? "Esta configuración se creará como una aplicación nueva basada en la plantilla."
              : "Las plantillas guardan la estructura del proyecto, pero no pueden iniciarse, detenerse, reiniciarse ni escalarse. Las alertas no se incluyen en una plantilla."}
          </p>

          {isTemplateSource && isTemplate && (
            <fieldset className={styles.templateSaveOptions} disabled={isCreating}>
              <legend>Al guardar la plantilla</legend>
              <label>
                <input
                  type="radio"
                  name="template-save-mode"
                  checked={!saveAsNewTemplate}
                  onChange={() => setSaveAsNewTemplate(false)}
                />
                Actualizar esta plantilla
              </label>
              <label>
                <input
                  type="radio"
                  name="template-save-mode"
                  checked={saveAsNewTemplate}
                  onChange={() => setSaveAsNewTemplate(true)}
                />
                Guardar como una plantilla nueva
              </label>
            </fieldset>
          )}

          <button className={styles.mainButton} onClick={handleSave} disabled={isCreating}>
            <Save size={20} />
            <span>
              {isCreating
                ? "Guardando..."
                : shouldCreateNew
                  ? isTemplate ? "Crear plantilla" : "Crear aplicación"
                  : isTemplateSource && isTemplate ? "Actualizar plantilla" : "Guardar"}
            </span>
          </button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Makefile</h3>

          <div className={styles.makeFileButtons}>
            <button
              className={styles.secondaryButton}
              onClick={handleSeeMakefile}
            >
              <FileText size={18} />
              Ver Makefile
            </button>

            <button
              className={styles.secondaryButtonBlue}
              onClick={handleCopyMakefile}
            >
              <Copy size={18} />
              Copiar Makefile
            </button>
          </div>
        </div>
      </div>
      <AlertSnackbar
        alertState={alertState}
        handleCloseAlert={handleCloseAlert}
      />

      {showMakefile && (
        <div
          className={styles.makefileOverlay}
          onClick={() => setShowMakefile(false)}
          role="presentation"
        >
          <div
            className={styles.makefileModal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="makefile-title"
          >
            <header className={styles.makefileHeader}>
              <div className={styles.makefileHeading}>
                <span className={styles.makefileIcon}>
                  <FileText size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 id="makefile-title" className={styles.makefileTitle}>Makefile</h3>
                  <p className={styles.makefileSubtitle}>Configuración generada para tu aplicación</p>
                </div>
              </div>
              <button
                type="button"
                className={styles.makefileClose}
                onClick={() => setShowMakefile(false)}
                aria-label="Cerrar vista del Makefile"
                title="Cerrar"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className={styles.codeToolbar}>
              <span className={styles.fileIndicator}>
                <span className={styles.fileDot} />
                Makefile
              </span>
              <span className={styles.lineCount}>
                {makefileContent.split("\n").length} líneas
              </span>
            </div>

            <pre className={styles.makefileCode}>
              <code>{makefileContent}</code>
            </pre>

            <footer className={styles.makefileFooter}>
              <span className={styles.footerHint}>Podes verlo mas adelante.</span>
              <div className={styles.makefileActions}>
                <button
                  type="button"
                  className={styles.copyMakefileButton}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(makefileContent);
                      showAlert("Makefile copiado al portapapeles.", "success", "Copiado Exitoso");
                    } catch (error) {
                      console.error(error);
                      showAlert("No se pudo copiar el Makefile. Inténtalo de nuevo.", "error", "Error al Copiar");
                    }
                  }}
                >
                  <Copy size={17} aria-hidden="true" />
                  Copiar
                </button>
                <button
                  type="button"
                  className={styles.closeMakefileButton}
                  onClick={() => setShowMakefile(false)}
                >
                  Cerrar
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
      <CreationModal open={isCreating} />
    </div>
  );
};

export default ConfigurationEditor;
