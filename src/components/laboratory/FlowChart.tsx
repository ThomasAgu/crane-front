"use client";

import React, { useState, useCallback } from "react";
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

const FlowChart = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "app", position: { x: 0, y: 0 }, data: { name: "Mi App", description: "Descripción de app" } },
    { id: "2", type: "service", position: { x: 300, y: 0 }, data: { name: "Auth Service", image: "v12.4.0", labels: ["Servicio", "Primero"], ports: "8080:43" } },
    { id: "3", type: "network", position: { x: 600, y: 0 }, data: { address: "192.168.5.0", name: "Red Interna" } },
    { id: "4", type: "volume", position: { x: 900, y: 0 }, data: { name: "Volumen X", amount: "5", type: "MB", containerPath: "home/sb1/abcData", localPath:"cd/data/app/info" } },
  ]);

  const [edges, setEdges] = useState<Edge[]>([{ id: "e1-2", source: "1", target: "2" }]);

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
