"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";

interface CreationModalProps {
  open: boolean;
}

const steps = [
  "Validando configuración...",
  "Generando Makefile...",
  "Preparando entorno Docker...",
  "Descargando imágenes desde Docker Hub...",
  "Creando contenedores...",
  "Iniciando servicios...",
  "Verificando servicios...",
  "Finalizando configuración...",
];

export default function CreationModal({
  open,
}: CreationModalProps) {
  const [currentStep, setCurrentStep] = useState(steps[0]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(steps[0]);
      return;
    }

    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;

      if (currentIndex >= steps.length) {
        currentIndex = steps.length - 1;
      }

      setCurrentStep(steps[currentIndex]);
    }, 2500);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg mx-4">
        <div className="flex flex-col items-center gap-5">
          <Loader
            loading={true}
            width={70}
            height={70}
          />

          <h2 className="text-2xl font-semibold text-darkest">
            Creando aplicación
          </h2>

          <p className="text-center text-gray-600 min-h-[24px]">
            {currentStep}
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-full animate-pulse bg-primary-blue" />
          </div>

          <p className="text-sm text-gray-500 text-center">
            Este proceso puede tardar algunos minutos dependiendo de las
            imágenes Docker utilizadas y de los recursos disponibles
            en el equipo.
          </p>
        </div>
      </div>
    </div>
  );
}