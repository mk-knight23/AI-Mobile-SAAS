import { Header } from "@/components/layout/header";
import { Canvas } from "@/components/editor/canvas";
import { ChatSidebar } from "@/components/editor/chat-sidebar";
import { EditorToolbar } from "@/components/editor/toolbar";
import { usePathname, useParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
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
            // Optimistic update / Loading state can be handled here
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

            // Add new node
            const newNode: Node<MobileFrameData> = {
                id: screen.id,
                type: "mobileFrame",
                position: { x: 100 + nodes.length * 450, y: 100 }, // Simple auto-layout
                data: {
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

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex-1 flex relative">
                <div className="flex-1 relative overflow-hidden">
                    <EditorToolbar />
                    <Canvas
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                    />
                </div>
                <ChatSidebar onSend={handleGenerate} />
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
