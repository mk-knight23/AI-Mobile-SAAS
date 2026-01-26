import React, { useCallback } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    Node,
    Edge,
    BackgroundVariant,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MobileFrame } from "./mobile-frame";
import { MobileFrameData } from "./types";

const nodeTypes = {
    mobileFrame: MobileFrame,
};

interface CanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    onRegenerate?: (screenId: string, prompt: string) => void;
    onDelete?: (screenId: string) => void;
}

export function Canvas({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onRegenerate,
    onDelete
}: CanvasProps) {
    return (
        <div className="w-full h-full bg-slate-50 dark:bg-slate-900 font-jakarta-sans">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={{
                    mobileFrame: (props) => (
                        <MobileFrame
                            {...props}
                            onRegenerate={onRegenerate}
                            onDelete={onDelete}
                        />
                    )
                }}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
