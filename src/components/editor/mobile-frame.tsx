"use client";

import React, { useRef } from "react";
import { Handle, Position, NodeProps, Node, NodeResizer } from "@xyflow/react";
import { Smartphone, Download, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MobileFrameData } from "./types";
import { toPng } from "html-to-image";

export function MobileFrame({ data, selected }: NodeProps<Node<MobileFrameData>>) {
    const frameRef = useRef<HTMLDivElement>(null);

    const handleExportPNG = async () => {
        if (frameRef.current) {
            const dataUrl = await toPng(frameRef.current, {
                cacheBust: true,
                style: { borderRadius: "2rem" }
            });
            const link = document.createElement("a");
            link.download = `${data.name || "screen"}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="group relative h-full w-full">
            <NodeResizer minWidth={300} minHeight={600} isVisible={selected} lineClassName="border-primary" handleClassName="h-3 w-3 bg-primary border-2 border-white rounded" />

            {/* Frame Toolbar */}
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2 py-1 glass rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold px-2 truncate">{data.name}</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                        <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-red-500 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={handleExportPNG}
                    >
                        <Download className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Device Mockup */}
            <div
                ref={frameRef}
                className="w-[320px] h-[640px] bg-black rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-1 ring-white/10"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10" />

                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Render Generated UI */}
                    <div
                        className="w-full h-full overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: data.html }}
                    />
                    {data.css && <style>{data.css}</style>}
                </div>
            </div>

            {/* Connection Handles */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
        </div>
    );
}
