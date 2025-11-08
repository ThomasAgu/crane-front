"use client";

import React, { useState } from "react";
import { editorService } from "@/src/app/services/EditorService";
import { createApp } from "@/src/lib/api/appService";

const ConfurationEditor: React.FC = () => {
  const [showMakefile, setShowMakefile] = useState(false);
  const [makefileContent, setMakefileContent] = useState("");

  const handleCreateApp = async () => {
    try {
      const payload = editorService.exportAppDto();
      if (!payload.name || (payload.services?.length ?? 0) === 0) {
        alert("No app name or no services detected in diagram.");
        return;
      }
      await createApp(payload as any);
      alert("Aplicación creada con éxito ✅");
    } catch (err) {
      console.error(err);
      alert("Error al crear la aplicación ❌");
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
      alert("Makefile copiado al portapapeles ✅");
    } catch (err) {
      console.error(err);
      alert("No se pudo copiar el Makefile ❌");
    }
  };

  return (
    <div>
      Aca van las opciones de confuguracion
      Opciones de guardado
      Importacion/Exportacion
      Activar el modo desarrollador

      <div className="mt-3 flex gap-2">
        <button
          className="px-3 py-1 bg-green-600 text-white rounded"
          onClick={handleCreateApp}
        >
          Crear aplicacion
        </button>

        <button
          className="px-3 py-1 bg-gray-800 text-white rounded"
          onClick={handleSeeMakefile}
        >
          Ver MakeFile
        </button>

        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={handleCopyMakefile}
        >
          Copiar MakeFile
        </button>
      </div>

      {showMakefile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowMakefile(false)}
        >
          <div
            className="bg-white w-11/12 max-w-3xl p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Generated Makefile</h3>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={async () => {
                    await navigator.clipboard.writeText(makefileContent);
                    alert("Makefile copiado ✅");
                  }}
                >
                  Copy
                </button>
                <button
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setShowMakefile(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <pre className="bg-gray-900 text-white p-3 rounded max-h-96 overflow-auto">
              {makefileContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfurationEditor;