"use client";

import { Header } from "@/components/layout/header";
import { Canvas } from "@/components/editor/canvas";
import { ChatSidebar } from "@/components/editor/chat-sidebar";
import { EditorToolbar } from "@/components/editor/toolbar";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Node, Edge, useNodesState, useEdgesState, addEdge, OnConnect } from "@xyflow/react";
import { MobileFrameData } from "@/components/editor/types";
import { toast } from "sonner";

function EditorContent({ projectId }: { projectId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isLoading, setIsLoading] = useState(false);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // Fetch project and screens on mount
    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (!res.ok) throw new Error("Failed to fetch project");
                const project = await res.json();

                if (project.screens && project.screens.length > 0) {
                    const loadedNodes: Node[] = project.screens.map((screen: any, idx: number) => ({
                        id: screen.id,
                        type: "mobileFrame",
                        position: { x: screen.x || 100 + idx * 400, y: screen.y || 100 },
                        data: {
                            id: screen.id,
                            name: screen.name,
                            html: screen.htmlContent,
                            css: screen.cssContent,
                        }
                    }));
                    setNodes(loadedNodes);
                }
            } catch (error) {
                console.error("Error loading project:", error);
                toast.error("Failed to load project.");
            }
        }
        fetchProject();
    }, [projectId, setNodes]);

    // Handle AI Generation
    const handleGenerate = async (prompt: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    prompt,
                }),
            });

            if (!res.ok) throw new Error("Failed to generate");

            const data = await res.json();
            const screen = data.screen;

            const newNode: Node<MobileFrameData> = {
                id: screen.id,
                type: "mobileFrame",
                position: { x: 100 + nodes.length * 450, y: 100 },
                data: {
                    id: screen.id,
                    name: screen.name,
                    html: screen.htmlContent,
                    css: screen.cssContent,
                },
            };

            setNodes((nds) => [...nds, newNode]);
            toast.success("Screen generated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate screen.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle screen regeneration
    const handleRegenerate = async (screenId: string, prompt: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    prompt,
                    screenId,
                }),
            });

            if (!res.ok) throw new Error("Failed to regenerate");

            const data = await res.json();
            const screen = data.screen;

            // Update existing node
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === screenId
                        ? {
                            ...node,
                            data: {
                                ...node.data,
                                id: screen.id,
                                name: screen.name,
                                html: screen.htmlContent,
                                css: screen.cssContent,
                            },
                        }
                        : node
                )
            );
            toast.success("Screen regenerated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to regenerate screen.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle screen deletion
    const handleDelete = async (screenId: string) => {
        try {
            const res = await fetch(`/api/screens/${screenId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            setNodes((nds) => nds.filter((node) => node.id !== screenId));
            toast.success("Screen deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete screen.");
        }
    };

    // Handle save project
    const handleSave = async () => {
        const screens = nodes.map((node) => ({
            id: node.id,
            x: node.position.x,
            y: node.position.y,
            width: node.data.width || 375,
            height: node.data.height || 812,
            name: node.data.name,
        }));

        const res = await fetch("/api/projects/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectId,
                screens,
            }),
        });

        if (!res.ok) throw new Error("Failed to save");
        return res.json();
    };

    // Handle add screen
    const handleAddScreen = async () => {
        const res = await fetch(`/api/projects/${projectId}/screens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Screen" }),
        });

        if (!res.ok) throw new Error("Failed to add screen");

        const data = await res.json();
        const screen = data.screen;

        const newNode: Node<MobileFrameData> = {
            id: screen.id,
            type: "mobileFrame",
            position: { x: 100 + nodes.length * 450, y: 100 },
            data: {
                id: screen.id,
                name: screen.name,
                html: screen.htmlContent,
                css: screen.cssContent,
            },
        };

        setNodes((nds) => [...nds, newNode]);
        return data;
    };

    // Handle undo/redo (placeholder)
    const handleUndo = () => {
        toast.info("Undo feature coming soon");
    };

    const handleRedo = () => {
        toast.info("Redo feature coming soon");
    };

    // Handle version history (placeholder)
    const handleVersionHistory = () => {
        toast.info("Version history coming soon");
    };

    // Handle share
    const handleShare = () => {
        const shareUrl = `${window.location.origin}/editor/${projectId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex-1 flex relative">
                <div className="flex-1 relative overflow-hidden">
                    <EditorToolbar
                        projectId={projectId}
                        onSave={handleSave}
                        onAddScreen={handleAddScreen}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onVersionHistory={handleVersionHistory}
                        onShare={handleShare}
                    />
                    <Canvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onRegenerate={handleRegenerate}
                        onDelete={handleDelete}
                    />
                </div>
                <ChatSidebar
                    projectId={projectId}
                    onSend={handleGenerate}
                />
            </div>
        </div>
    );
}

export default function EditorPage() {
    const params = useParams();
    const projectId = params?.projectId as string;

    if (!projectId) return <div>Invalid Project ID</div>;

    return (
        <EditorContent projectId={projectId} />
    );
}
