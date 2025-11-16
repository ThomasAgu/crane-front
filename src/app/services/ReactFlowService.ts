import { Node, Edge } from "reactflow";

export type TemplateType =
  | "blank"
  | "microservices"
  | "database"
  | "simple-api";

export class ReactFlowService {
  /**
   * Recibe un tipo de template y devuelve nodos + edges
   * para renderizar en React Flow.
   * 
   */

  //TODO: Implementar la importacion y exportacion en este servicio
  getTemplateGraph(template: TemplateType): { nodes: Node[]; edges: Edge[] } {
    switch (template) {
      case "microservices":
        return {
          nodes: [
            {
              id: "1",
              type: "app",
              position: { x: 0, y: 0 },
              data: { name: "App Principal", description: "Cliente principal" },
            },
            {
              id: "2",
              type: "service",
              position: { x: 300, y: 0 },
              data: { name: "Servicio Auth", image: "v1.0", ports: "8080:80" },
            },
            {
              id: "3",
              type: "service",
              position: { x: 300, y: 150 },
              data: { name: "Servicio Users", image: "v1.0", ports: "8081:81" },
            },
            {
              id: "4",
              type: "network",
              position: { x: 600, y: 75 },
              data: { name: "Red interna", address: "10.0.0.1" },
            },
          ],
          edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e1-3", source: "1", target: "3" },
            { id: "e2-4", source: "2", target: "4" },
            { id: "e3-4", source: "3", target: "4" },
          ],
        };

      case "database":
        return {
          nodes: [
            {
              id: "1",
              type: "service",
              position: { x: 0, y: 0 },
              data: { name: "API Server", image: "v2.0", ports: "8080:80" },
            },
            {
              id: "2",
              type: "network",
              position: { x: 300, y: 0 },
              data: { name: "Red DB", address: "192.168.1.1" },
            },
            {
              id: "3",
              type: "volume",
              position: { x: 600, y: 0 },
              data: { name: "DB Data", amount: "10", type: "GB" },
            },
          ],
          edges: [
            { id: "e1-2", source: "1", target: "2" },
            { id: "e2-3", source: "2", target: "3" },
          ],
        };

      case "simple-api":
        return {
          nodes: [
            {
              id: "1",
              type: "app",
              position: { x: 0, y: 0 },
              data: { name: "Cliente Web" },
            },
            {
              id: "2",
              type: "service",
              position: { x: 300, y: 0 },
              data: { name: "API REST", ports: "8080:80" },
            },
          ],
          edges: [{ id: "e1-2", source: "1", target: "2" }],
        };

      case "blank":
      default:
        return { nodes: [], edges: [] };
    }
  }
}

export const reactFlowService = new ReactFlowService();
