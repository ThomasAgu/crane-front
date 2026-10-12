import React from "react";
import { Database, Boxes, Layers, Square } from "lucide-react";

export interface DefaultTemplate {
  id: string;
  title: string;
  description: string;
  services: number;
  icon: React.ReactNode;
}

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    id: "blank",
    title: "Aplicación en blanco",
    description: "Diseña tu arquitectura desde cero, con total libertad.",
    services: 0,
    icon: <Square size={36} />,
  },
  {
    id: "microservices",
    title: "Microservicios",
    description: "Una arquitectura distribuida lista para personalizar.",
    services: 2,
    icon: <Layers size={36} />,
  },
  {
    id: "database",
    title: "Base de datos",
    description: "Comienza con un servicio y almacenamiento persistente.",
    services: 1,
    icon: <Database size={36} />,
  },
  {
    id: "simple-api",
    title: "API REST simple",
    description: "Un punto de partida ligero para crear tu API.",
    services: 1,
    icon: <Boxes size={36} />,
  },
];