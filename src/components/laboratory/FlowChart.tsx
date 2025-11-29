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

import { App } from "./nodes/App";
import { Service } from "./nodes/Service";
import { Network } from "./nodes/Network";
import { Volume } from "./nodes/Volume";
import Sidebar from "./editor/SideBar";
import ContextMenu from "./ContextMenu";
import { editorService } from "../../app/services/EditorService";
import { AppDto } from "@/src/lib/dto/AppDto";

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

  const onConnect = useCallback((params: Connection) => setEdges((es) => addEdge(params, es)), []);

  const onNodeClick = (_: any, node: Node) => {
    //when node is same type as selceted somehow the editor don't change
    setSelectedNode(node);
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
      onUpdateNode={(id, newData) => {
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
          )
        );
      }} 
    />
    </div>
  );
};

export default FlowChart;
