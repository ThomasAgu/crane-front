"use client";
import React, { useState, useEffect, useCallback } from "react";
import { reactFlowService, TemplateType } from "../../app/services/ReactFlowService";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { dockerDefaults } from "@/lib/helper/DockerDefaults";

import { App } from "./nodes/app/App";
import { Service } from "./nodes/service/Service";
import { Network } from "./nodes/network/Network";
import { Volume } from "./nodes/volume/Volume";
import Sidebar from "./editor/SideBar";
import ContextMenu from "./ContextMenu";
import { editorService } from "../../app/services/EditorService";
import { AppDto } from "@/lib/dto/AppDto";
import { useAlert, AlertSnackbar } from '@/components/ui/AlertSnackbar'


const nodeTypes = { app: App, service: Service, network: Network, volume: Volume };

interface FlowChartInterface {
  selectedTemplate: string | null,
  selectedApp?: AppDto | null
} 

const FlowChart: React.FC<FlowChartInterface> = ({selectedTemplate, selectedApp}) => {
  useEffect(() => {
    if (selectedTemplate) {
      const { nodes, edges } = reactFlowService.getTemplateGraph(selectedTemplate as TemplateType);
      setNodes(nodes);
      setEdges(edges);
      editorService.updateState(nodes, edges);
    }

    if (selectedApp) {
      const { nodes, edges } = reactFlowService.getGraphForApp(selectedApp);
      setNodes(nodes);
      setEdges(edges);
      editorService.updateState(nodes, edges);
    }
  }, [selectedTemplate, selectedApp]);

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (ev.button === 0) setContextMenu(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const { nodes: newNodes, edges: newEdges } = e.detail || {};
      if (Array.isArray(newNodes)) setNodes([...newNodes]);
      if (Array.isArray(newEdges)) setEdges([...newEdges]);
    };
    window.addEventListener("editorService:updated", handler);
    return () => window.removeEventListener("editorService:updated", handler);
  }, []);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number, nodeId?: string } | null>(null);
  //alert
  const { alertState, showAlert, handleCloseAlert } = useAlert();


  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => {
      const updatedNodes = applyNodeChanges(changes, ns);
      editorService.setNodes(updatedNodes);
      onEdgesChange([]); 
      return updatedNodes;
    });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => {
      const updatedEdges = applyEdgeChanges(changes, es); 
      editorService.setEdges(updatedEdges);
      return updatedEdges;
    });
  }, []);

  const onConnect = useCallback((params: Connection) => {
  // 1. Validar si la conexión está permitida por tus reglas
  if (!params.source || !params.target) return;
  
  const isValid = editorService.isValidEdgeConnection(params.source, params.target);
  
  if (!isValid) {
    showAlert("Conexión no permitida entre estos nodos.", "error", "Error");
    console.warn(`Conexión inválida: No se permite conectar ${params.source} con ${params.target}`);
    return;
  }

  setEdges((currentEdges) => {
    const nextEdges = addEdge(params, currentEdges);
    
    // Sincronizamos el singleton del servicio
    editorService.setEdges(nextEdges); 
    
    return nextEdges;
  });
}, [setEdges]); // Acuérdate de pasarle setEdges a las dependencias del useCallback

  const handleValidConnection = (connection: Connection) => {
    if (!connection.source || !connection.target) return false;
    return editorService.isValidEdgeConnection(connection.source, connection.target);
  };

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
    setSelectedNode((prev) => {
      if (prev && prev.id === node.id) {
    
        return { ...node }; 
      }
      return node;
    });
  }

  const onPanelContextMenu = (e: React.MouseEvent) => { 
    e.preventDefault();
    setContextMenu((prev) => (prev ? null : { x: e.clientX, y: e.clientY }));
  };

   const onNodeContextMenu = (e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId: node.id });
  };

  const onNodeDrag = useCallback((e: React.MouseEvent, node: Node) => {
    setContextMenu((prev) =>
      prev && prev.nodeId === node.id ? { x: e.clientX, y: e.clientY, nodeId: node.id } : prev
    )
  }, []);

  const addNode = (type: string, x: number, y: number, connectedTo: string) => {
    const id = `${+new Date()}`;
    const newNode: Node = { id, type, position: { x, y }, data: { name: editorService.getNodeNewNamesByType(type), label: `${type} nuevo` } };
    setNodes((nds) => [...nds, newNode]);
    
    if (connectedTo) {
      const newEdge: Edge = { id: `e${connectedTo}-${id}`, source: connectedTo, target: id };
      setEdges((eds) => [...eds, newEdge]);
    }
    setContextMenu(null);
  };

  const onDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((es) => es.filter((e) => e.source !== id && e.target !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
    setContextMenu(null);
  };

  const onUpdateNode = (id: string, newData: any) => {
  editorService.setNodeData(id, newData);

  let freshNodes = [...editorService.getNodes()];
  let freshEdges = [...editorService.getEdges()];

  const updatedNode = freshNodes.find((n) => n.id === id);
  if (updatedNode && updatedNode.type === "service" && newData.image) {
    const defaults = dockerDefaults[newData.image];

    if (defaults && Array.isArray(defaults.volumes)) {
      defaults.volumes.forEach((volumePath: string, index: number) => {
        
        const isAlreadyConnected = freshEdges.some((edge) => {
          if (edge.source !== id) return false;
          const targetNode = freshNodes.find((n) => n.id === edge.target);
          return targetNode?.type === "volume" && targetNode.data?.containerPath === volumePath;
        });

        if (!isAlreadyConnected) {
          const volumeNodeId = `vol-${Date.now()}-${index}`;
          
          const newVolumeNode: Node = {
            id: volumeNodeId,
            type: "volume",
            position: {
              x: updatedNode.position.x + 320,
              y: updatedNode.position.y + (index * 120),
            },
            data: {
              name: `vol_${newData.image}_data`,
              label: "volume nuevo",
              type: "volume",
              size: 20,
              containerPath: volumePath,
              localPath: "",
            },
          };

          const newEdge: Edge = {
            id: `e-${id}-${volumeNodeId}`,
            source: id,
            target: volumeNodeId,
            style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5" }, 
          };

          freshNodes.push(newVolumeNode);
          freshEdges.push(newEdge);
        }
      });

      editorService.setNodes(freshNodes);
      editorService.setEdges(freshEdges);
    }
  }

  setTimeout(() => {
    setEdges([...freshEdges]);
    setNodes([...freshNodes]);

    setSelectedNode((prev) => {
      if (prev && prev.id === id) {
        return {
          ...prev,
          data: { ...prev.data, ...newData },
        };
      }
      return prev;
    });
  }, 0);
};
  
  return (
    <div className="flex w-full h-full">
      {/* Lienzo */}
      <div style={{marginLeft: "70px", width: "95vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={handleValidConnection}
          onNodeClick={onNodeClick}
          onPaneContextMenu={onPanelContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDrag={onNodeDrag}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        
        <ContextMenu
          position={contextMenu} 
          addNode={addNode} 
          nodes={nodes}
          onDeleteNode={onDeleteNode}
        />

      </div>

    <Sidebar 
      selectedNode={selectedNode} 
      nodes={nodes}
      edges={edges}
      selectedApp={selectedApp}
      onUpdateNode={onUpdateNode} 
    />
    <AlertSnackbar
        alertState={alertState}
        handleCloseAlert={handleCloseAlert}
    />
    </div>
  );
};

export default FlowChart;
