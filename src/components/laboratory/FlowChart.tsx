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

const nodeTypes = { app: App, service: Service, network: Network, volume: Volume };

interface FlowChartInterface {
  selectedTemplate: string | null
} 

const FlowChart: React.FC<FlowChartInterface> = ({selectedTemplate}) => {
  useEffect(() => {
    if (selectedTemplate) {
      const { nodes, edges } = reactFlowService.getTemplateGraph(selectedTemplate as TemplateType);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [selectedTemplate]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)), []);
  const onConnect = useCallback((params: Connection) => setEdges((es) => addEdge(params, es)), []);

  const onNodeClick = (_: any, node: Node) => setSelectedNode(node);
  const onPaneContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY });
  };

  const addNode = (type: string, x: number, y: number) => {
    const id = `${+new Date()}`;
    const newNode: Node = { id, type, position: { x, y }, data: { label: `${type} nuevo` } };
    setNodes((nds) => [...nds, newNode]);
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
          onPaneContextMenu={onPaneContextMenu}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
        
        <ContextMenu position={contextMenu} addNode={addNode} />
      </div>

    <Sidebar 
      selectedNode={selectedNode} 
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
