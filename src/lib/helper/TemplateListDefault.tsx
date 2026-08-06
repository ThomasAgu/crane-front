import React from "react";
import { Database, Boxes, Layers, Square } from "lucide-react";

export interface DefaultTemplate {
  id: string;
  title: string;
  description: string;
  services: number;
  rules: number;
  icon: React.ReactNode;
}

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    id: "blank",
    title: "Aplicación en blanco",
    description: "Un modelo que te desafía a arrancar desde cero",
    services: 0,
    rules: 0,
    icon: <Square size={80} />,
  },
  {
    id: "microservices",
    title: "Microservicios",
    description: "API REST y Base de datos SQL",
    services: 2,
    rules: 4,
    icon: <Layers size={80} />,
  },
  {
    id: "database",
    title: "Base de datos",
    description: "Arranca con un servicio de base de datos preseleccionado",
    services: 1,
    rules: 0,
    icon: <Database size={80} />,
  },
  {
    id: "simple-api",
    title: "API REST simple",
    description: "Node.js y Express para guardar datos",
    services: 2,
    rules: 4,
    icon: <Boxes size={80} />,
  },
];