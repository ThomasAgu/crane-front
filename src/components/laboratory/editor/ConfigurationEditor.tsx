"use client";
import React, { useState } from "react";
import { editorService } from "@/app/services/EditorService";
import { AppService } from "@/lib/api/appService";
import { useAlert, AlertSnackbar } from "../../ui/AlertSnackbar";
import { useUserId } from "@/hooks/useUserId";
import styles from "./ConfigurationEditor.module.css";
import { FileText, Copy, PlusCircle, Save } from "lucide-react";
import CreationModal from "../CreationModal";

const ConfurationEditor: React.FC<{ isSaved: boolean }> = ({ isSaved }) => {
  const [showMakefile, setShowMakefile] = useState(false);
  const [makefileContent, setMakefileContent] = useState("");

  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const [isCreating, setIsCreating] = useState(false);

  
  const userId = useUserId();

  const handleCreateApp = async () => {
    try {
      const payload = editorService.exportAppDto();
      if (!payload.name) {
        showAlert(
          "No se detectó un nombre de aplicación",
          "error",
          "Validación Requerida"
        );
        return;
      }
      if (!payload.services || payload.services.length === 0) {
        showAlert(
          "No se detectaron servicios en el diagrama. Agrega al menos un servicio para crear la aplicación.",
          "error",
          "Validación Requerida"
        );
        return;
      }
      if (payload.services.some((s) => !s.name || s.name.trim() === "")) {
        showAlert(
          "Todos los servicios deben tener un nombre definido.",
          "error",
          "Validación Requerida"
        );
        return;
      }
      if (payload?.services?.some((s) => !s.image)) {
        showAlert(
          "Todos los servicios deben tener una imagen definida.",
          "error",
          "Validación Requerida"
        );
        return;
      }
      //Volumenes
      if (payload?.services?.map((s) => s.volumes).flat().length > 0) {
        for (const v of payload?.services?.map((s) => s.volumes).flat()) {
          const errors = validateVolume(v);

          if (errors.length > 0) {
            showAlert(
              errors.join("\n"),
              "error",
              "Validación Requerida"
            );
            return;
          }
        }
      }

      //redes 
      const allNetworks = payload?.services
        ?.flatMap((s) => s.networks || [])
        ?? [];

      if (allNetworks.length > 0) {
        for (const net of allNetworks) {
          if (typeof net.name !== "string" || net.name.trim() === "") {
            showAlert(
              "Todas las redes deben tener un nombre definido.",
              "error",
              "Validación Requerida"
            );
            return;
          }
        }
      }
    
      setIsCreating(true);
      await AppService.create(payload as any);
      showAlert(
        "La aplicación se ha creado con éxito.",
        "success",
        "Creación Exitosa"
      );
    }
    catch (err) {
      if (err instanceof Error && err.message.includes("App with this name already exists")) {
        showAlert(
          "Ya tienes una aplicación con ese nombre. Por favor, elige un nombre diferente.",
          "error",
          "Nombre de Aplicación Duplicado"
        );
        return;
      }
      else {
        showAlert(
          "Hubo un error al intentar crear la aplicación.",
          "error",
          "Error en la Creación"
        );
      }
    }
    finally {
      setIsCreating(false);
    }
  };

  function validateVolume(v: any) {
    const errors = [];
    const pathRegex = /^\/:(\/[A-Za-z0-9._-]+)+$/;

    if (typeof v.path !== "string" || !pathRegex.test(v.path)) {
      errors.push(
        `El path '${v.path}' no es válido. Debe tener forma '/:/folder/subfolder'.`
      );
    }
    return errors;
  }

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

          {isSaved ? (
            <button className={styles.mainButton} onClick={handleCreateApp}>
              <Save size={20} />
              <span>
                {isCreating ? "Creando..." : isSaved ? "Guardar" : "Crear"}
             </span>
            </button>
          ) : (
            <button className={styles.mainButton} onClick={handleCreateApp}>
              <PlusCircle size={20} />
              <span>Crear</span>
            </button>
          )}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-darkest"
          onClick={() => setShowMakefile(false)}
        >
          <div
            className="bg-white w-11/12 max-w-3xl p-5 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-darkest">Makefile</h3>

              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-[var(--primary-blue)] border hover:bg-blue-700 transition"
                  onClick={async () => {
                    await navigator.clipboard.writeText(makefileContent);
                    showAlert("Makefile copiado al portapapeles.", "success");
                  }}
                >
                  <Copy size={18} />
                  Copiar
                </button>

                <button
                  className="px-4 py-2 rounded-lg text-darkest border hover:bg-gray-500 hover:text-white transition"
                  onClick={() => setShowMakefile(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>

            <pre className="bg-darkest text-light-grey p-4 rounded-lg max-h-96 overflow-auto text-sm">
              {makefileContent}
            </pre>
          </div>
        </div>
      )}
      <CreationModal open={isCreating} />
    </div>
  );
};

export default ConfurationEditor;
