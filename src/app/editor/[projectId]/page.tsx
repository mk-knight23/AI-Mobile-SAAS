"use client";

import { Header } from "@/components/layout/header";
import { Canvas } from "@/components/editor/canvas";
import { ChatSidebar } from "@/components/editor/chat-sidebar";
import { EditorToolbar } from "@/components/editor/toolbar";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { Node, Edge, useNodesState, useEdgesState, addEdge, OnConnect } from "@xyflow/react";
import { MobileFrameData } from "@/components/editor/types";

interface ScreenResponse {
  id: string;
  name: string;
  htmlContent: string;
  cssContent: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}
import { toast } from "sonner";
import { PageLoader, ErrorBoundary } from "@/components/ui/loading";

function EditorContent({ projectId }: { projectId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [project, setProject] = useState<{ name: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    // Fetch project and screens on mount
    useEffect(() => {
        async function fetchProject() {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch project");
                }
                const data = await res.json();
                setProject({ name: data.name });

                if (data.screens && data.screens.length > 0) {
                    const loadedNodes: Node[] = data.screens.map((screen: ScreenResponse, idx: number) => ({
                        id: screen.id,
                        type: "mobileFrame",
                        position: { x: screen.x || 100 + idx * 400, y: screen.y || 100 },
                        data: {
                            id: screen.id,
                            name: screen.name,
                            html: screen.htmlContent,
                            css: screen.cssContent,
                            width: screen.width,
                            height: screen.height,
                        }
                    }));
                    setNodes(loadedNodes);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load project";
                setError(message);
                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProject();
    }, [projectId, setNodes]);

    // Handle AI Generation
    const handleGenerate = useCallback(async (prompt: string) => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId,
                    prompt,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to generate");
            }

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
                    width: screen.width,
                    height: screen.height,
                },
            };

            setNodes((nds) => [...nds, newNode]);
            toast.success("Screen generated successfully!");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to generate screen";
            toast.error(message);
        } finally {
            setIsGenerating(false);
        }
    }, [projectId, nodes.length, setNodes]);

    // Handle screen regeneration
    const handleRegenerate = useCallback(async (screenId: string, prompt: string) => {
        setIsGenerating(true);
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
                                width: screen.width,
                                height: screen.height,
                            },
                        }
                        : node
                )
            );
            toast.success("Screen regenerated successfully!");
        } catch {
            toast.error("Failed to regenerate screen.");
        } finally {
            setIsGenerating(false);
        }
    }, [projectId, setNodes]);

    // Handle screen deletion
    const handleDelete = useCallback(async (screenId: string) => {
        try {
            const res = await fetch(`/api/screens/${screenId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            setNodes((nds) => nds.filter((node) => node.id !== screenId));
            toast.success("Screen deleted");
        } catch {
            toast.error("Failed to delete screen.");
        }
    }, [setNodes]);

    // Handle save project
    const handleSave = useCallback(async () => {
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
    }, [projectId, nodes]);

    // Handle add screen
    const handleAddScreen = useCallback(async () => {
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
                width: screen.width,
                height: screen.height,
            },
        };

        setNodes((nds) => [...nds, newNode]);
        return data;
    }, [projectId, nodes.length, setNodes]);

    // Handle undo (placeholder)
    const handleUndo = useCallback(() => {
        toast.info("Undo feature coming soon");
    }, []);

    const handleRedo = useCallback(() => {
        toast.info("Redo feature coming soon");
    }, []);

    const handleVersionHistory = useCallback(() => {
        toast.info("Version history coming soon");
    }, []);

    // Handle share
    const handleShare = useCallback(() => {
        const shareUrl = `${window.location.origin}/editor/${projectId}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <PageLoader text="Loading project..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Failed to Load Project</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = "/projects"}
                                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                            >
                                Go to Projects
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex-1 flex relative">
                <div className="flex-1 relative overflow-hidden">
                    <EditorToolbar
                        projectId={projectId}
                        projectName={project?.name}
                        onSave={handleSave}
                        onAddScreen={handleAddScreen}
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        onVersionHistory={handleVersionHistory}
                        onShare={handleShare}
                        isGenerating={isGenerating}
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
                    isGenerating={isGenerating}
                />
            </div>
        </div>
    );
}

function EditorLoading() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <PageLoader text="Initializing editor..." />
            </div>
        </div>
    );
}

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params?.projectId as string;

    // Validate project ID format
    useEffect(() => {
        if (projectId && !/^[a-zA-Z0-9-_]+$/.test(projectId)) {
            toast.error("Invalid project ID");
            router.replace("/projects");
        }
    }, [projectId, router]);

    if (!projectId) {
        return (
            <div className="flex flex-col h-screen overflow-hidden">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Invalid Project</h1>
                        <p className="text-muted-foreground mb-4">Project ID is missing or invalid.</p>
                        <button
                            onClick={() => router.replace("/projects")}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Go to Projects
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary
            fallback={
                <div className="flex flex-col h-screen overflow-hidden">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <h2 className="text-xl font-bold mb-2">Editor Error</h2>
                            <p className="text-muted-foreground mb-4">Something went wrong while loading the editor.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <Suspense fallback={<EditorLoading />}>
                <EditorContent projectId={projectId} />
            </Suspense>
        </ErrorBoundary>
    );
}
