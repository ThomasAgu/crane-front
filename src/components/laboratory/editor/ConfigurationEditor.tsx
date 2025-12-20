"use client";

import React, { useState } from "react";
import { editorService } from "@/src/app/services/EditorService";
import { AppService } from "@/src/lib/api/appService";
import { useAlert, AlertSnackbar } from "../../ui/AlertSnackbar";
import styles from "./ConfigurationEditor.module.css";
import { FileText, Copy, PlusCircle } from "lucide-react";

const ConfurationEditor: React.FC = () => {
  const [showMakefile, setShowMakefile] = useState(false);
  const [makefileContent, setMakefileContent] = useState("");

  const { alertState, showAlert, handleCloseAlert } = useAlert();

  const handleCreateApp = async () => {
    try {
      const payload = editorService.exportAppDto();
      if (!payload.name || (payload.services?.length ?? 0) === 0) {
        showAlert(
          "No se detectó un nombre de aplicación o no hay servicios en el diagrama.",
          "warning",
          "Validación Requerida"
        );
        return;
      }
      await AppService.create(payload as any);
      showAlert(
        "La aplicación se ha creado con éxito.",
        "success",
        "Creación Exitosa"
      );
    } catch (err) {
      console.error(err);
      showAlert(
        "Hubo un error al intentar crear la aplicación.",
        "error",
        "Error en la Creación"
      );
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
          <h3 className={styles.sectionTitle}>Aplicación</h3>

          <button className={styles.mainButton} onClick={handleCreateApp}>
            <PlusCircle size={20} />
            Crear aplicación
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-primary-blue hover:bg-light-blue-grey transition"
                  onClick={async () => {
                    await navigator.clipboard.writeText(makefileContent);
                    showAlert("Makefile copiado al portapapeles.", "success");
                  }}
                >
                  <Copy size={18} />
                  Copiar
                </button>

                <button
                  className="px-4 py-2 rounded-lg text-white bg-error hover:bg-red-700 transition"
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
    </div>
  );
};

export default ConfurationEditor;
