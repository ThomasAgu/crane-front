"use client";

import React, { useEffect, useState } from "react";
import CraneLoader from "../ui/CraneLoader";

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

export default function CreationModal({ open }: CreationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null; // Descomenta esto para que se oculte cuando 'open' sea false

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg mx-4">
        <div className="flex flex-col items-center gap-5">
          <CraneLoader 
            loading={true}
            text="Creando aplicación"
            subtext={steps[currentIndex]}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}