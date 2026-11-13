"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  // CUSTOMER LANE
  {
    id: "cust-1",
    type: "default",
    data: { label: "1. Register & Browse Gear" },
    position: { x: 50, y: 50 },
    style: { background: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
  {
    id: "cust-2",
    type: "default",
    data: { label: "2. Select Dates & Add to Cart" },
    position: { x: 50, y: 150 },
    style: { background: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
  {
    id: "cust-3",
    type: "default",
    data: { label: "3. Pay via Stripe / SSLCommerz" },
    position: { x: 50, y: 250 },
    style: { background: "#18181b", color: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },

  // PROVIDER LANE
  {
    id: "prov-1",
    type: "default",
    data: { label: "4. Provider Uploads Inventory" },
    position: { x: 380, y: 50 },
    style: { background: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
  {
    id: "prov-2",
    type: "default",
    data: { label: "5. Confirm Order & Fulfill Pickup" },
    position: { x: 380, y: 150 },
    style: { background: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
  {
    id: "prov-3",
    type: "default",
    data: { label: "6. Return Inspection & Settlement" },
    position: { x: 380, y: 250 },
    style: { background: "#fff", border: "1px solid #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },

  // ADMIN OVERSIGHT LANE
  {
    id: "admin-1",
    type: "default",
    data: { label: "Admin: Moderate Users & Suspend" },
    position: { x: 710, y: 100 },
    style: { background: "#FDFBF7", border: "2px dashed #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
  {
    id: "admin-2",
    type: "default",
    data: { label: "Admin: Audit Global Rentals & Categories" },
    position: { x: 710, y: 200 },
    style: { background: "#FDFBF7", border: "2px dashed #18181b", padding: "12px", fontFamily: "monospace", fontSize: "11px", borderRadius: "0px" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "cust-1", target: "cust-2", animated: true },
  { id: "e2-3", source: "cust-2", target: "cust-3", animated: true },
  { id: "e3-p2", source: "cust-3", target: "prov-2", label: "Trigger Payment", style: { stroke: "#18181b" } },
  { id: "ep1-p2", source: "prov-1", target: "prov-2", animated: true },
  { id: "ep2-p3", source: "prov-2", target: "prov-3", animated: true },
  { id: "ea1-a2", source: "admin-1", target: "admin-2", animated: false },
];

export default function WorkflowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[500px] bg-[#FDFBF7] border border-border relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls className="bg-card border border-border shadow-xs rounded-none" />
        <MiniMap className="bg-card border border-border" zoomable pannable />
        <Background gap={16} size={1} color="#e4e4e7" />
      </ReactFlow>
    </div>
  );
}