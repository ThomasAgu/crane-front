import { Node, Edge } from "reactflow";
import { AppDto } from "@/src/lib/dto/AppDto";

export type TemplateType =
  | "blank"
  | "microservices"
  | "database"
  | "custom"
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
      case "custom":
        return { nodes: [], edges: [] };
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
  
  getGraphForApp(appDto: AppDto): { nodes: Node[]; edges: Edge[] } {
       const nodes: Node[] = [];
        const edges: Edge[] = [];

        // Add the main App node
        nodes.push({
          id: `app-${appDto.id}`,
          type: "app",
          position: { x: 0, y: 0 },
          data: {
            name: appDto.name,
            description: "Aplicación personalizada",
            actuales: appDto.current_scale,
          },
        });

        // Add Service nodes
        appDto.services?.forEach((service, index) => {
          const serviceId = `service-${index}`;
          nodes.push({
            id: serviceId,
            type: "service",
            position: { x: 300, y: index * 150 },
            data: {
              name: service.name,
              image: service.image,
              ports: service.ports?.join(", ") || "N/A",
              labels: service.labels || [],
            },
          });

          // Connect App node to Service node
          edges.push({
            id: `edge-app-${serviceId}`,
            source: `app-${appDto.id}`,
            target: serviceId,
          });
        });

        // Add Network nodes (if any)
        appDto.hosts?.forEach((host, index) => {
          const networkId = `network-${index}`;
          nodes.push({
            id: networkId,
            type: "network",
            position: { x: 600, y: index * 150 },
            data: {
              name: `Red ${index + 1}`,
              address: host.address || "192.168.0.1",
            },
          });

          // Connect Service nodes to Network node
          appDto.services?.forEach((_, serviceIndex) => {
            edges.push({
              id: `edge-service-${serviceIndex}-network-${index}`,
              source: `service-${serviceIndex}`,
              target: networkId,
            });
          });
        });

        // Add Volume nodes (if any)
        appDto.services?.forEach((service, serviceIndex) => {
          service.volumes?.forEach((volume, volumeIndex) => {
            const volumeId = `volume-${serviceIndex}-${volumeIndex}`;
            nodes.push({
              id: volumeId,
              type: "volume",
              position: { x: 900, y: serviceIndex * 150 + volumeIndex * 50 },
              data: {
                name: `Volumen ${volumeIndex + 1}`,
                containerPath: volume,
                localPath: `/data/${volumeIndex}`,
                size: 20,
              },
            });

            // Connect Service node to Volume node
            edges.push({
              id: `edge-service-${serviceIndex}-volume-${volumeIndex}`,
              source: `service-${serviceIndex}`,
              target: volumeId,
            });
          });
        });

        return { nodes, edges };
    
  }
}

export const reactFlowService = new ReactFlowService();
