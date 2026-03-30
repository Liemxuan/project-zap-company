"use client";

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { CheckCircle2, CircleDashed, Clock } from 'lucide-react';

export interface OmniJobGraphNode {
    _id: string;
    status: "PENDING" | "RUNNING" | "COMPLETED" | "BLOCKED" | "FAILED";
    dependsOn: string[];
    payload: any;
    queueName: string;
}

interface WorkflowGraphProps {
    jobs: OmniJobGraphNode[];
}

export function WorkflowGraph({ jobs }: WorkflowGraphProps) {
    const { nodes, edges } = useMemo(() => {
        const generatedNodes: Node[] = [];
        const generatedEdges: Edge[] = [];
        
        // Group by layers to simulate simple DAG distribution mapping
        const getLayer = (id: string, visited = new Set<string>()): number => {
           if (visited.has(id)) return 0;
           visited.add(id);
           const job = jobs.find(j => j._id === id);
           if (!job || !job.dependsOn || job.dependsOn.length === 0) return 0;
           return 1 + Math.max(...job.dependsOn.map(dId => getLayer(dId, visited)));
        };

        const layerMap = new Map<string, number>();
        let maxLayer = 0;
        jobs.forEach(j => {
            const l = getLayer(j._id);
            layerMap.set(j._id, l);
            if (l > maxLayer) maxLayer = l;
        });

        // Distribute elements based on layer sequentially
        const layerCounts = new Map<number, number>();

        jobs.forEach(job => {
            const layer = layerMap.get(job._id) || 0;
            const currentIdx = layerCounts.get(layer) || 0;
            layerCounts.set(layer, currentIdx + 1);
            
            // X position spaced horizontally, Y spaced vertically by DAG height map
            const xOffset = 250 * currentIdx + 100;
            const yOffset = layer * 150 + 50;

            const isCompleted = job.status === "COMPLETED";
            const isBlocked = job.status === "BLOCKED";
            const isPending = job.status === "PENDING" || job.status === "RUNNING";
            
            let bgColor = "var(--layer-base, rgba(40,40,40,0.8))";
            let borderColor = "var(--outline, rgba(255,255,255,0.1))";
            if (isCompleted) {
                borderColor = "#10b981"; // M3 Success mapping
                bgColor = "rgba(16,185,129,0.1)";
            } else if (isPending) {
                borderColor = "#3b82f6"; // M3 Active mapping
                bgColor = "rgba(59,130,246,0.1)";
            } else if (isBlocked) {
                borderColor = "rgba(255,255,255,0.05)";
                bgColor = "var(--layer-cover, rgba(20,20,20,0.8))";
            }

            generatedNodes.push({
                id: job._id,
                position: { x: xOffset, y: yOffset },
                data: { 
                    label: (
                        <div className="flex flex-col gap-1 items-start text-left w-[180px] text-on-surface">
                             <div className="flex items-center gap-1.5 w-full justify-between">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Task {job._id.slice(-4)}</span>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[9px] uppercase font-bold tracking-widest opacity-80 ${isCompleted ? 'text-[#10b981]' : isPending ? 'text-[#3b82f6]' : 'text-inherit'}`}>
                                        {job.status}
                                    </span>
                                    {isCompleted && <CheckCircle2 className="size-3 text-emerald-500" />}
                                    {isPending && <Clock className="size-3 text-blue-500 animate-pulse" />}
                                    {isBlocked && <CircleDashed className="size-3 text-on-surface-variant opacity-50" />}
                                </div>
                             </div>
                             <span className="text-[12px] font-semibold truncate w-full text-on-surface">{job.payload?.intent || job.queueName}</span>
                        </div>
                    ) 
                },
                style: {
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: isPending ? '0 0 20px rgba(59,130,246,0.15)' : 'none',
                    fontFamily: 'inherit',
                }
            });

            // Generate DAG edges to blocking children
            if (job.dependsOn) {
                job.dependsOn.forEach(depId => {
                    generatedEdges.push({
                        id: `e-${depId}-${job._id}`,
                        source: depId,
                        target: job._id,
                        animated: isPending || isCompleted,
                        style: { stroke: isCompleted ? '#10b981' : 'rgba(255,255,255,0.15)', strokeWidth: 2 },
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: isCompleted ? '#10b981' : 'rgba(255,255,255,0.15)',
                        },
                    });
                });
            }
        });

        return { nodes: generatedNodes, edges: generatedEdges };
    }, [jobs]);

    return (
        <div className="w-full h-[500px]">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                fitView 
                className="bg-transparent"
                minZoom={0.5}
            >
                <Background color="rgba(255,255,255,0.05)" gap={16} />
                <Controls className="filter invert opacity-70 border-none shadow-xl" />
            </ReactFlow>
        </div>
    );
} 
